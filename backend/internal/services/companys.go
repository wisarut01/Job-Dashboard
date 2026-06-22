package services

import (
	"github.com/job_dashboard_backend/internal/models"
	"github.com/job_dashboard_backend/internal/repositorys"
)

type CompaniesService struct {
	repo *repositorys.CompaniesRepository
	userRepo *repositorys.UserRepository
}

func NewCompaniesService(repo *repositorys.CompaniesRepository, userRepo *repositorys.UserRepository) *CompaniesService {
	return &CompaniesService{
		repo: repo,
		userRepo: userRepo,
	}
}

// CreateCompanyService(...) error
// GetCompanyService(id uint) (*models.Companies, error)
// GetAllCompaniesService() ([]models.Companies, error)
// UpdateCompanyService(id uint, ...) error
// DeleteCompanyService(id uint) error

func (s *CompaniesService) CreateCompanyService(id uint, name, country string) error {
	companyDetail := &models.Companies{
		Name:    name,
		Country: country,
	}

	if err := s.repo.CreateCompanyRepository(companyDetail); err != nil {
		return err
	}

	return s.userRepo.UpdatedCompanyIdRepository(id, companyDetail.ID)
}

func (s *CompaniesService) GetCompanyByIdService(id uint) (*models.Companies, error) {
	return s.repo.GetCompanyByIDRepository(id)
}

func (s *CompaniesService) GetAllCompaniesService() ([]models.Companies, error) {
	return s.repo.GetAllCompaniesRepository()
}

func (s *CompaniesService) UpdateCompanyService(id uint, name string, country string) error {
	return s.repo.UpdateCompanyRepository(id, name, country)
}

func (s *CompaniesService) DeleteCompanyService(id uint) error {
	return s.repo.DeleteCompanyRepository(id)
}
