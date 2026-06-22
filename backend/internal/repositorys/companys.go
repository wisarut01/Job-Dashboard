package repositorys

import (
	"github.com/job_dashboard_backend/internal/models"
	"gorm.io/gorm"
)

type CompaniesRepository struct {
	database *gorm.DB
}

func NewCompaniesRepository(database *gorm.DB) *CompaniesRepository {
	return &CompaniesRepository{
		database: database,
	}
}

// CreateCompanyRepository(company *models.Companies) error
// GetCompanyByIDRepository(id uint) (*models.Companies, error)
// GetAllCompaniesRepository() ([]models.Companies, error)
// UpdateCompanyRepository(id uint, data *models.Companies) error
// DeleteCompanyRepository(id uint) error

func (r *CompaniesRepository) CreateCompanyRepository(companyDetail *models.Companies) error {
	return r.database.Create(companyDetail).Error
}

func (r *CompaniesRepository) GetCompanyByIDRepository(id uint) (*models.Companies, error) {
	companyData := &models.Companies{}

	if err := r.database.Where("id = ?", id).First(companyData).Error; err != nil {
		return nil, err
	}

	return companyData, nil
}

func (r *CompaniesRepository) GetAllCompaniesRepository() ([]models.Companies, error) {
	companiesData := &[]models.Companies{}

	if err := r.database.Preload("Users").Preload("Jobs").Find(companiesData).Error; err != nil {
		return nil, err
	}

	return *companiesData, nil
}

func (r *CompaniesRepository) UpdateCompanyRepository(id uint,name string, country string) error {
	updatedData := &models.Companies{}

	if err := r.database.Where("id = ?", id).First(updatedData).Error; err != nil {
		return err
	}

	updatedData.Name = name
	updatedData.Country = country

	if err := r.database.Save(updatedData).Error; err != nil {
		return err
	}

	return nil
}

func (r *CompaniesRepository) DeleteCompanyRepository(id uint) error {
	return r.database.Delete(&models.Companies{}, id).Error
}
