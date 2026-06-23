package handlers

import (
    "strconv"

    "github.com/gofiber/fiber/v3"
    "github.com/job_dashboard_backend/internal/services"
)

type ApplicationHandler struct {
    service *services.ApplicationService
}

func NewApplicationHandler(service *services.ApplicationService) *ApplicationHandler {
    return &ApplicationHandler{service: service}
}

type CreateApplicationReq struct {
    JobId uint `json:"job_id"`
}

func (h *ApplicationHandler) GetApplicationsHandler(ctx fiber.Ctx) error {
    userID := ctx.Locals("id").(uint)

    apps, err := h.service.GetApplicationsService(userID)
    if err != nil {
        return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": err.Error(),
        })
    }

    return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
        "applications": apps,
    })
}

func (h *ApplicationHandler) GetApplicationByIDHandler(ctx fiber.Ctx) error {
    userID := ctx.Locals("id").(uint)
    appID, err := strconv.Atoi(ctx.Params("id"))
    if err != nil {
        return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "invalid id",
        })
    }

    app, err := h.service.GetApplicationByIDService(uint(appID), userID)
    if err != nil {
        return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
            "error": err.Error(),
        })
    }

    return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
        "application": app,
    })
}

func (h *ApplicationHandler) CreateApplicationHandler(ctx fiber.Ctx) error {
    userID := ctx.Locals("id").(uint)

    body := &CreateApplicationReq{}
    if err := ctx.Bind().Body(body); err != nil {
        return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": err.Error(),
        })
    }

    if err := h.service.CreateApplicationService(userID, body.JobId); err != nil {
        return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": err.Error(),
        })
    }

    return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{
        "message": "Applied successfully",
    })
}

func (h *ApplicationHandler) DeleteApplicationHandler(ctx fiber.Ctx) error {
    userID := ctx.Locals("id").(uint)
    appID, err := strconv.Atoi(ctx.Params("id"))
    if err != nil {
        return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "invalid id",
        })
    }

    if err := h.service.DeleteApplicationService(uint(appID), userID); err != nil {
        return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{
            "error": err.Error(),
        })
    }

    return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
        "message": "Application cancelled",
    })
}