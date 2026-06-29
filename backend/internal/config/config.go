package config

import (
	"os"
)

type ConfigVariable struct {
	APP_PORT 	string
	DB_HOST		string
	DB_PORT		string
	DB_USER		string
	DB_PASSWORD string
	DB_NAME		string
	DB_SSLMODE  string
	SECRET_KEY	string
}

func Config() *ConfigVariable {
	app_port := os.Getenv("PORT")
	if app_port == "" {
		app_port = "8000"
	}

	return &ConfigVariable{
		APP_PORT: app_port,
		DB_HOST: os.Getenv("DB_HOST"),
		DB_PORT: os.Getenv("DB_PORT"),
		DB_USER: os.Getenv("DB_USER"),
		DB_PASSWORD: os.Getenv("DB_PASSWORD"),
		DB_NAME: os.Getenv("DB_NAME"),
		DB_SSLMODE: os.Getenv("DB_SSLMODE"),
		SECRET_KEY: os.Getenv("SECRET_KEY"),
	}
}
