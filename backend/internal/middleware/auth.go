package middleware

import (
	"fmt"
	"os"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
	"github.com/job_dashboard_backend/internal/models"
)

type Claims struct {
	ID 		uint 			`json:"id"`
	Name 	string  		`json:"name"`
	Role	models.RoleType	`json:"role"`
	jwt.RegisteredClaims
}

func JWTVerify(ctx fiber.Ctx) error {
	// TODO: implement JWT token verification
	//get token from cookie
	tokenString := ctx.Cookies("jwt")

	if tokenString == "" {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"Error": "Missing token.",
		})
	}

	//extract token 
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (any, error) {
		return []byte(os.Getenv("SECRET_KEY")), nil
	})
	if err != nil || !token.Valid {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"Error": err.Error(),
		})
	}
	fmt.Println(token)
	fmt.Println("claims: ", claims)

	ctx.Locals("id", claims.ID)
	ctx.Locals("name", claims.Name)
	ctx.Locals("role", claims.Role)

	return ctx.Next()
}

func RequireRole(ctx fiber.Ctx) error {
	//required employer role for create and updated Jobs -> create update(deleted if job has applicants)
	role, ok := ctx.Locals("role").(models.RoleType)
	if !ok {
		return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"Error": "Role not found.",
		})
	}

	if role == models.Employer {
		return ctx.Next()
	}

	return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{
		"Error": "Don't have permission.",
	})
}
