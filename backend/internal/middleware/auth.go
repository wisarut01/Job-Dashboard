package middleware

import "github.com/gofiber/fiber/v3"

func JWTVerify(ctx fiber.Ctx) error {
	// TODO: implement JWT token verification
	return ctx.Next()
}
