package repositorys

import (
	"github.com/job_dashboard_backend/internal/models"
	"gorm.io/gorm"
)

type UserRepository struct {
	database *gorm.DB
}

func NewUserRepository(database *gorm.DB) *UserRepository {
	return &UserRepository{
		database: database,
	}
}

func (r *UserRepository) CreateUserRepository(user *models.Users) error {
	return r.database.Create(user).Error
}

func (r *UserRepository) GetUserRepository(id uint) (*models.Users, error) {
	userData := &models.Users{}

	if err := r.database.Where("id = ?", id).First(userData).Error; err != nil {
		return nil, err
	}

	return userData, nil
}

func (r *UserRepository) GetUserByEmailRepository(email string) (*models.Users, error) {
	userData := &models.Users{}

	if err := r.database.Where("email = ?", email).First(userData).Error; err != nil {
		return nil, err
	}

	return userData, nil
}

func (r *UserRepository) UpdatedCompanyIdRepository(id uint, company_id uint) error {
	return r.database.Model(&models.Users{}).Where("id = ?", id).Update("company_id", company_id).Error
}
