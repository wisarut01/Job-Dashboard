package models

import "gorm.io/gorm"

type Jobs struct {
	gorm.Model
	Title		string	`gorm:"size:100;not null"`
	Description string	`gorm:"not null"`
	Salary 		int		`gorm:"not null;default:0"`
	Remote 		bool 	`gorm:"not null;default:false"`
	Location 	string	`gorm:"size:100;not null"`
	CompanyId 	uint		`gorm:"not null"`
	Applications []Applications `gorm:"foreignKey:JobId;reference:ID"`
}