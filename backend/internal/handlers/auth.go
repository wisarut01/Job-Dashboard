package handlers

import (
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
	"github.com/job_dashboard_backend/internal/middleware"
	"github.com/job_dashboard_backend/internal/models"
	"github.com/job_dashboard_backend/internal/services"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler struct {
	authService *services.AuthService
	secretKey 	string
}

func NewAuthHandler(authService *services.AuthService, secretKey string) *AuthHandler {
	return &AuthHandler{
		authService: authService,
		secretKey: secretKey,
	}
}

type RegisterBodyReq struct {
	Email    string          `json:"email"`
	Password string          `json:"password"`
	Name     string          `json:"name"`
	Role     models.RoleType `json:"role"`
}

type LoginBodyReq struct {
	Email		string	`json:"email"`
	Password	string	`json:"password"`
}

func (h *AuthHandler) Register(ctx fiber.Ctx) error {
	req := &RegisterBodyReq{}

	if err := ctx.Bind().Body(req); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	if req.Password == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "password is empty",
		})
	}

	if err := h.authService.RegisterService(req.Name, req.Email, req.Password, req.Role); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "register success",
	})
}

func (h *AuthHandler) Login(ctx fiber.Ctx) error {
	loginReq := &LoginBodyReq{}

	if err := ctx.Bind().Body(loginReq); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": err.Error(),
		})
	}

	userData, err := h.authService.GetUserByEmailService(loginReq.Email)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": err,
		})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(userData.Password),[]byte(loginReq.Password)); err != nil {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"Error": err,
		})
	}

	claims := middleware.Claims{
		ID: userData.ID,
		Name: userData.Name,
		Role: userData.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 72)),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signedToken, err := token.SignedString([]byte(h.secretKey))
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": err.Error(),
		})
	}

	ctx.Cookie(&fiber.Cookie{
		Name: "jwt",
		Value: signedToken,
		Expires: time.Now().Add(time.Hour * 72),
		HTTPOnly: true,
		Secure: false,
		SameSite: "Lax",
		Path: "/",
	})	

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message": "Login success",
	})
}

func (h *AuthHandler) Logout(ctx fiber.Ctx) error {
	ctx.Cookie(&fiber.Cookie{
		Name: "jwt",
		Value: "",
		Expires: time.Now().Add(-time.Hour),
		HTTPOnly: true,
	})

	return ctx.JSON(fiber.Map{
		"Message": "Logout success",
	})
}
