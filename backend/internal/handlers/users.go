package handlers

import (

	"github.com/gofiber/fiber/v3"
	"github.com/job_dashboard_backend/internal/services"
)

type UserHandler struct {
	service *services.UserService
}

func NewUserHandler(service *services.UserService) *UserHandler {
	return &UserHandler{
		service: service,
	}
} 

func (h *UserHandler) GetUserHandler(ctx fiber.Ctx) error {
	id := ctx.Locals("id").(uint)

	userData, err := h.service.GetUserService(uint(id))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"user": userData,
	})
}
