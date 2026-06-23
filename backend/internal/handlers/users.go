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

type UpdatedBodyReq struct {
	Name	string	`json:"name"`
}

type UpdatedPasswordBodyReq struct {
	OldPassword	string	`json:"oldPassword"`
	NewPassword	string	`json:"newPassword"`
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

func (h *UserHandler) UpdatedUserHandler(ctx fiber.Ctx) error {
	id := ctx.Locals("id").(uint)

	updatedData := &UpdatedBodyReq{}
	if err := ctx.Bind().Body(updatedData); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": err.Error(),
		})
	}

	if err := h.service.UpdatedUserService(id, updatedData.Name); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": err.Error(),
		})
	}
	
	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message": "Updated completed.",
	})
}

func (h *UserHandler) UpdatedUserPasswordHandler(ctx fiber.Ctx) error {
	id := ctx.Locals("id").(uint)

	updatedData := &UpdatedPasswordBodyReq{}
	if err := ctx.Bind().Body(updatedData); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": err.Error(),
		})
	}		

	if err := h.service.UpdatedUserPasswordService(id, updatedData.OldPassword, updatedData.NewPassword); 
		err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"Error": err.Error(),
			})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message": "Updated success.",
	})
}

func (h *UserHandler) DeletedUserHandler(ctx fiber.Ctx) error {
	id := ctx.Locals("id").(uint)

	if err := h.service.DeletedUserService(id); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": err.Error(),
		})
	}
		
	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message": "Deleted success.",
	})
}
