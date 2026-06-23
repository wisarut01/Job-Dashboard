package services

import (
    "errors"

    "github.com/job_dashboard_backend/internal/models"
    "github.com/job_dashboard_backend/internal/repositorys"
)

type ApplicationService struct {
    repo     *repositorys.ApplicationRepository
    userRepo *repositorys.UserRepository
    jobRepo  *repositorys.JobRepository
}

func NewApplicationService(
    repo *repositorys.ApplicationRepository,
    userRepo *repositorys.UserRepository,
    jobRepo *repositorys.JobRepository,
) *ApplicationService {
    return &ApplicationService{repo: repo, userRepo: userRepo, jobRepo: jobRepo}
}

func (s *ApplicationService) GetApplicationsService(userID uint) ([]models.Applications, error) {
    user, err := s.userRepo.GetUserRepository(userID)
    if err != nil {
        return nil, err
    }

    if user.Role == models.Employer {
        if user.CompanyId == nil {
            return nil, errors.New("you don't have a company")
        }
        // employer ดู applications ที่เข้ามาใน company ตัวเอง
        return s.repo.GetApplicationsByCompanyRepository(*user.CompanyId)
    }

    // jobseeker ดู applications ที่ตัวเองส่ง
    return s.repo.GetApplicationsByUserRepository(userID)
}

func (s *ApplicationService) GetApplicationByIDService(appID uint, userID uint) (*models.Applications, error) {
    app, err := s.repo.GetApplicationByIDRepository(appID)
    if err != nil {
        return nil, errors.New("application not found")
    }

    user, err := s.userRepo.GetUserRepository(userID)
    if err != nil {
        return nil, err
    }

    if user.Role == models.Jobseeker && app.UserId != userID {
        return nil, errors.New("not your application")
    }

    return app, nil
}

func (s *ApplicationService) CreateApplicationService(userID uint, jobID uint) error {
    user, err := s.userRepo.GetUserRepository(userID)
    if err != nil {
        return err
    }
    if user.Role != models.Jobseeker {
        return errors.New("only jobseekers can apply")
    }

    job, err := s.jobRepo.GetJobByIDRepository(jobID)
    if err != nil {
        return errors.New("job not found")
    }
    _ = job 

    existing := []models.Applications{}
    app := &models.Applications{
        UserId: userID,
        JobId:  jobID,
        Status: models.Pending,
    }
    return s.repo.CreateApplicationRepository(app)
}

func (s *ApplicationService) DeleteApplicationService(appID uint, userID uint) error {
    app, err := s.repo.GetApplicationByIDRepository(appID)
    if err != nil {
        return errors.New("application not found")
    }

    if app.UserId != userID {
        return errors.New("not your application")
    }

    return s.repo.DeleteApplicationRepository(appID)
}