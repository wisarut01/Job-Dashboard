package repositorys

import (
	"github.com/job_dashboard_backend/internal/models"
	"gorm.io/gorm"
)

type JobRepository struct {
	database *gorm.DB
}

func NewJobRepository(database *gorm.DB) *JobRepository {
	return &JobRepository{
		database: database,
	}
}


// CreateJobRepository(job *models.Jobs) error
//   GetAllJobsRepository() ([]models.Jobs, error)
//   GetJobByIDRepository(id uint) (*models.Jobs, error)
//   UpdateJobRepository(id uint, data UpdateJobReq) error
//   CloseJobRepository(id uint) error   ← ไม่ใช่ Delete!

func (r *JobRepository) CreateJobRepository(job *models.Jobs) error {
	return r.database.Create(job).Error
}

func (r *JobRepository) GetAllJobsRepository() ([]models.Jobs, error) {
	jobs := []models.Jobs{}

	
	if err := r.database.Where("status = ?", models.Open).Find(&jobs).Error; err != nil {
		return nil, err
	}

	return jobs, nil
}

func (r *JobRepository) GetJobByIDRepository(jobId uint) (*models.Jobs, error) {
	jobs := &models.Jobs{}

	if err := r.database.Where("id = ?", jobId).First(jobs).Error; err != nil {
		return nil, err
	}

	return jobs, nil
}

func (r *JobRepository) UpdateJobRepository(jobId uint, title string, description string, 
										salary int, remote bool, location string) error {
	updateData := &models.Jobs{}
	if err := r.database.Where("id = ?", jobId).First(updateData).Error; err != nil {
		return err
	}

	updateData.Title 		= title
	updateData.Description 	= description
	updateData.Salary		= salary
	updateData.Remote		= remote
	updateData.Location		= location

	return r.database.Save(updateData).Error
}

func (r *JobRepository) CloseJobRepository(jobId uint) error {
	return r.database.Delete(&models.Jobs{}, jobId).Error
}

func (r *JobRepository) GetJobByCompanyIDRepository(companyID uint) ([]models.Jobs, error) {
	jobs := []models.Jobs{}

	if err := r.database.Where("company_id = ?", companyID).Find(&jobs).Error; err != nil {
		return nil, err
	}

	return jobs, nil
}
