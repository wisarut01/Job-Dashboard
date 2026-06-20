package handlers

import (
	"github.com/gofiber/fiber/v3"
	"github.com/job_dashboard_backend/internal/models"
	"github.com/job_dashboard_backend/internal/services"
)

type AuthHandler struct {
	authService *services.AuthService
}

func NewAuthHandler(authService *services.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
	}
}

type RegisterBodyReq struct {
	Email    string          `json:"email"`
	Password string          `json:"password"`
	Name     string          `json:"name"`
	Role     models.RoleType `json:"role"`
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

	if err := h.authService.Register(req.Name, req.Email, req.Password, req.Role); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "register success",
	})
}
