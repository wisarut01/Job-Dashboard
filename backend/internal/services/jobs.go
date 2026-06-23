package services

import (
	"errors"

	"github.com/job_dashboard_backend/internal/models"
	"github.com/job_dashboard_backend/internal/repositorys"
)

// CreateJobService(userID uint, req CreateJobReq) error
//   GetAllJobsService() ([]models.Jobs, error)
//   GetJobByIDService(id uint) (*models.Jobs, error)
//   UpdateJobService(userID, jobID uint, req UpdateJobReq) error
//   CloseJobService(userID, jobID uint) error

type JobService struct {
	repo *repositorys.JobRepository
	userRepo *repositorys.UserRepository //to get company_id from user models
}

func NewJobService(repo *repositorys.JobRepository, userRepo *repositorys.UserRepository) *JobService {
	return &JobService{
		repo: repo,
		userRepo: userRepo,
	}
}

func (s *JobService) CreateJobService(userId uint, title string, description string, 
									salary int, remote bool, location string) error {
	job := &models.Jobs{
		Title: title,
		Description: description,
		Salary: salary,
		Remote: remote,
		Location: location,
	}

	userDetail, err := s.userRepo.GetUserRepository(userId)
	if err != nil {
		return err
	}

	if userDetail.CompanyId == nil {
   		return errors.New("please create a company before posting jobs")
	}	

	job.CompanyId = *userDetail.CompanyId

	return s.repo.CreateJobRepository(job)
}

func (s *JobService) GetAllJobsService() ([]models.Jobs, error) {
	return s.repo.GetAllJobsRepository()
}

func (s *JobService) GetJobByIDService(jobID uint) (*models.Jobs, error) {
	return s.repo.GetJobByIDRepository(jobID)
}

func (s *JobService) UpdateJobService(jobID uint, userID uint, title string, description string, 
									salary int, remote bool, location string) error {
	//actually pack those data to models jobs then send as parameter to repository but lazy hahaha
	user, err := s.userRepo.GetUserRepository(userID)
	if err != nil { return err }
	job, err := s.repo.GetJobByIDRepository(jobID)
	if err != nil { return errors.New("job not found") }
	
	if *user.CompanyId != job.CompanyId {
		return errors.New("Not your own job.")
	}
	
	if salary <= 0 {
		return errors.New("Salary must more than 0.")
	}

	return s.repo.UpdateJobRepository(jobID, title, description, salary, remote, location)
}

func (s *JobService) CloseJobService(userID uint, jobID uint) error {
	user, err := s.userRepo.GetUserRepository(userID)
    if err != nil { return err }
    job, err := s.repo.GetJobByIDRepository(jobID)
    if err != nil { return err }

    if *user.CompanyId != job.CompanyId {
        return errors.New("not your own job")
    }
	return s.repo.CloseJobRepository(jobID)
}
