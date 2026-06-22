package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v3"
	"github.com/job_dashboard_backend/internal/services"
)

type CompanyHandlers struct {
	service *services.CompaniesService
}

func NewCompanyHandlers(service services.CompaniesService) *CompanyHandlers {
	return &CompanyHandlers{
		service: &service,
	}
}

// CreateCompanyHandler(ctx fiber.Ctx) error
// GetCompanyHandler(ctx fiber.Ctx) error
// GetAllCompaniesHandler(ctx fiber.Ctx) error
// UpdateCompanyHandler(ctx fiber.Ctx) error
// DeleteCompanyHandler(ctx fiber.Ctx) error

type CompanyBodyReq struct {
	Name	string	`json:"name"`
	Country	string	`json:"country"`
}

func (h *CompanyHandlers) CreateCompanyHandler(ctx fiber.Ctx) error {
	userId := ctx.Locals("id").(uint)

	bodyReq := &CompanyBodyReq{}
	if err := ctx.Bind().Body(bodyReq); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": err.Error(),
		})
	}

	if err := h.service.CreateCompanyService(userId, bodyReq.Name, bodyReq.Country); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": err.Error(),
		})
	}

	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{
		"Message": "Create company profile success.",
	})
}

func (h *CompanyHandlers) GetCompanyByIdHandler(ctx fiber.Ctx) error {
	idString := ctx.Params("id")
	id, err := strconv.Atoi(idString)
	if err != nil {
    	return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid id"})
	}

	companyDetail, err := h.service.GetCompanyByIdService(uint(id))
	if err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"Error": err,
		})
	}

	return ctx.Status(fiber.StatusFound).JSON(fiber.Map{
		"Message": "Found company detail",
		"Detail": companyDetail,
	})
}

func (h *CompanyHandlers) GetAllCompaniesHandler(ctx fiber.Ctx) error {
	allCompanyDetail, err := h.service.GetAllCompaniesService()
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": err,
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message": "Found all company detail.",
		"Detail": allCompanyDetail,
	})
}

func (h *CompanyHandlers) UpdateCompanyHandler(ctx fiber.Ctx) error {
	idString := ctx.Params("id")
	id, err := strconv.Atoi(idString)
	if err != nil {
    	return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid id"})
	}

	updatedData := &CompanyBodyReq{}

	if err := ctx.Bind().Body(updatedData); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": err,
		})
	}

	if err := h.service.UpdateCompanyService(uint(id), updatedData.Name, updatedData.Country); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": err,
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message": "Updated success.",
	})
}

func (h *CompanyHandlers) DeleteCompanyHandler(ctx fiber.Ctx) error {
	idString := ctx.Params("id")
	id, err := strconv.Atoi(idString)
	if err != nil {
    	return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid id"})
	}
	
	if err := h.service.DeleteCompanyService(uint(id)); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": err,
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message": "Deleted completed.",
	})
}
