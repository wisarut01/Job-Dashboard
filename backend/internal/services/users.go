package services

import (
	"github.com/job_dashboard_backend/internal/models"
	"github.com/job_dashboard_backend/internal/repositorys"
	"golang.org/x/crypto/bcrypt"
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

func (s *UserService) UpdatedUserService(id uint, name string) error {
	return s.repo.UpdatedUserRepository(id, name)
}

func (s *UserService) UpdatedUserPasswordService(id uint, oldPassword string, newPassword string) error {
	//confirm old password to change password -> Maybe in modern is use verify code from email to confirm 
	//but do not have knowledge about this hahaha
	userData, err := s.repo.GetUserRepository(id)
	if err != nil {
		return err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(userData.Password), []byte(oldPassword)); err != nil {
		return err
	}

	newHashPassword,err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	return s.repo.UpdatedUserPasswordRepository(id, string(newHashPassword))
}

func (s *UserService) DeletedUserService(id uint) error {
	return s.repo.DeletedUserRepository(id)
}
