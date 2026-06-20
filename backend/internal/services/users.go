package services

import (
	"github.com/job_dashboard_backend/internal/models"
	"github.com/job_dashboard_backend/internal/repositorys"
)

type UserService struct {
	repo *repositorys.UserRepository
}

func NewUserService(repo *repositorys.UserRepository) *UserService {
	return &UserService{
		repo: repo,
	}
}

func (s *UserService) GetUserService(id uint) (*models.Users, error) {
	userData, err := s.repo.GetUserRepository(id)
	if err != nil {
		return &models.Users{}, err
	}

	return userData, nil
}
