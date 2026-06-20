package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v3"
	"github.com/job_dashboard_backend/internal/config"
	"github.com/job_dashboard_backend/internal/handlers"
	"github.com/job_dashboard_backend/internal/middleware"
	"github.com/job_dashboard_backend/internal/models"
	"github.com/job_dashboard_backend/internal/repositorys"
	"github.com/job_dashboard_backend/internal/services"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	//load env file to project 
	if err := godotenv.Load(); err != nil {
		log.Fatal("Cannot load env file: ", err.Error())
	}

	//get config parameter from env file
	configParam := config.Config()

	//gorm with postgres 
	dsn := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=%s",
		configParam.DB_USER,
		configParam.DB_PASSWORD,
		configParam.DB_HOST,
		configParam.DB_PORT,
		configParam.DB_NAME,
		configParam.DB_SSLMODE) //database config parameter

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Cannot connect database: ", err.Error())
	}
	
	if err := database.AutoMigrate(
		&models.Companies{},
		&models.Users{}, 
		&models.Jobs{},
		&models.Applications{},
	); err != nil {
		log.Fatal("Cannot create table: ", err.Error())
	}//create table in database

	//create fiber app 
	app := fiber.New()

	//init handler service repository in each table
	//Users
	userRepo := repositorys.NewUserRepository(database)
	userService := services.NewUserService(userRepo)
	userHandler := handlers.NewUserHandler(userService)
	//Jobs

	//Companies

	//Applications

	//Auth
	authService := services.NewAuthService(userRepo)
	authHandler := handlers.NewAuthHandler(authService)

	app.Post("/register", authHandler.Register)
	
	//middleware
	app.Use()
	app.Get("/user/:id", userHandler.GetUserHandler)
	if err := app.Listen(":" + configParam.APP_PORT); err != nil {
		log.Fatal("Error to listen: ", err.Error())
	}
}
