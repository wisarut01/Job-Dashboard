package services

import (
	"github.com/job_dashboard_backend/internal/models"
	"github.com/job_dashboard_backend/internal/repositorys"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	userRepo *repositorys.UserRepository
}

func NewAuthService(userRepo *repositorys.UserRepository) *AuthService {
	return &AuthService{
		userRepo: userRepo,
	}
}

func (s *AuthService) RegisterService(name, email, password string, role models.RoleType) error {
	hashPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user := &models.Users{
		Name:     name,
		Email:    email,
		Password: string(hashPassword),
		Role:     role,
	}

	return s.userRepo.CreateUserRepository(user)
}

func (s *AuthService) GetUserByEmailService(email string) (*models.Users, error) {
	return s.userRepo.GetUserByEmailRepository(email)
}
