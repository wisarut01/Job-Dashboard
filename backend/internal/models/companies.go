package models

import "gorm.io/gorm"

type Companies struct {
	gorm.Model
	Name 		string 	`gorm:"size:100;not null"`
	Country		string	`gorm:"size:100;not null"`
	Users		[]Users	`gorm:"foreignKey:CompanyId;reference:ID"`
	Jobs		[]Jobs	`gorm:"foreignKey:CompanyId;reference:ID"`
}
