package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v3"
	"github.com/job_dashboard_backend/internal/services"
)

type JobsHandler struct {
	service *services.JobService
}

func NewJobsHandler(service *services.JobService) *JobsHandler {
	return &JobsHandler{
		service: service,
	}
}

type CreateJobReq struct {
	Title		string	`json:"title"`
	Description	string	`json:"description"`
	Salary		int		`json:"salary"`
	Remote		bool	`json:"remote"`
	Location	string	`json:"location"`
}

type UpdateJobReq struct {
	Title		string	`json:"title"`
	Description	string	`json:"description"`
	Salary		int		`json:"salary"`
	Remote		bool	`json:"remote"`
	Location	string	`json:"location"`
}

//   CreateJobHandler(ctx fiber.Ctx) error
//   GetAllJobsHandler(ctx fiber.Ctx) error
//   GetJobByIDHandler(ctx fiber.Ctx) error
//   UpdateJobHandler(ctx fiber.Ctx) error
//   CloseJobHandler(ctx fiber.Ctx) error

func (h *JobsHandler) CreateJobHandler(ctx fiber.Ctx) error {
	userID := ctx.Locals("id").(uint)
	jobReqBody := &CreateJobReq{}

	if err := ctx.Bind().Body(jobReqBody); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": err,
		})
	}

	if err := h.service.CreateJobService(userID, jobReqBody.Title, jobReqBody.Description, jobReqBody.Salary, jobReqBody.Remote, jobReqBody.Location); 
		err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"Error": err,
			})
	}	

	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{
		"Message": "Created success.",
	})
}

func (h *JobsHandler) GetAllJobsHandler(ctx fiber.Ctx) error {
	jobs, err := h.service.GetAllJobsService()
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message": "Complete.",
		"Detail": jobs,
	})
}

func (h *JobsHandler) GetJobByIDHandler(ctx fiber.Ctx) error {
	jobID, err := strconv.Atoi(ctx.Params("id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": err.Error(),
		})
	}

	jobs, err := h.service.GetJobByIDService(uint(jobID))
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": err.Error(),
		})
	}

	return ctx.Status(fiber.StatusFound).JSON(fiber.Map{
		"Message": "Job found.",
		"Detail": jobs,
	})
}

func (h *JobsHandler) UpdateJobHandler(ctx fiber.Ctx) error {
	jobID, err := strconv.Atoi(ctx.Params("id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": err.Error(),
		})
	}
	userID := ctx.Locals("id").(uint)

	updateData := &UpdateJobReq{}

	if err := ctx.Bind().Body(updateData); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": err.Error(),
		})
	}

	if err := h.service.UpdateJobService(uint(jobID), userID, 
		updateData.Title, updateData.Description, 
		updateData.Salary, updateData.Remote, 
		updateData.Location); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message": "Updated success.",
	})
}

func (h *JobsHandler) CloseJobHandler(ctx fiber.Ctx) error {
	userID := ctx.Locals("id").(uint)
	
	jobId, err := strconv.Atoi(ctx.Params(":id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"Error": err.Error(),
		})
	}

	if err := h.service.CloseJobService(userID, uint(jobId)); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"Error": err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"Message": "Close job success.",
	})
}
