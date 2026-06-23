package repositorys

import (
    "github.com/job_dashboard_backend/internal/models"
    "gorm.io/gorm"
)

type ApplicationRepository struct {
    database *gorm.DB
}

func NewApplicationRepository(database *gorm.DB) *ApplicationRepository {
    return &ApplicationRepository{database: database}
}

func (r *ApplicationRepository) GetApplicationsByUserRepository(userID uint) ([]models.Applications, error) {
    apps := []models.Applications{}
    if err := r.database.Where("user_id = ?", userID).Find(&apps).Error; err != nil {
        return nil, err
    }
    return apps, nil
}

func (r *ApplicationRepository) GetApplicationsByCompanyRepository(companyID uint) ([]models.Applications, error) {
    apps := []models.Applications{}
    if err := r.database.
        Joins("JOIN jobs ON jobs.id = applications.job_id").
        Where("jobs.company_id = ? AND jobs.deleted_at IS NULL", companyID).
        Find(&apps).Error; err != nil {
        return nil, err
    }
    return apps, nil
}

func (r *ApplicationRepository) GetApplicationByIDRepository(appID uint) (*models.Applications, error) {
    app := &models.Applications{}
    if err := r.database.Where("id = ?", appID).First(app).Error; err != nil {
        return nil, err
    }
    return app, nil
}

func (r *ApplicationRepository) CreateApplicationRepository(app *models.Applications) error {
    return r.database.Create(app).Error
}

func (r *ApplicationRepository) DeleteApplicationRepository(appID uint) error {
    return r.database.Delete(&models.Applications{}, appID).Error
}