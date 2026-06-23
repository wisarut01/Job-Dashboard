package models

import "gorm.io/gorm"

type JobStatus string

const (
	Open	JobStatus = "open"
	Close	JobStatus = "close"
)

type Jobs struct {
	gorm.Model
	Title		string	`gorm:"size:100;not null"`
	Description string	`gorm:"not null"`
	Salary 		int		`gorm:"not null;default:0"`
	Remote 		bool 	`gorm:"not null;default:false"`
	Location 	string	`gorm:"size:100;not null"`
	Status 		JobStatus `gorm:"type:varchar(20);not null;default:open"`
	CompanyId 	uint	`gorm:"not null"`
	Applications []Applications `gorm:"foreignKey:JobId;reference:ID"`
}


