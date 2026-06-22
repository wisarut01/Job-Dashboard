package models

import "gorm.io/gorm"

type RoleType string

const (
	Jobseeker RoleType = "jobseeker"
	Employer	  RoleType = "employer"
)

type Users struct {
	gorm.Model 
	Name		string 		`gorm:"size:100;not null"`
	Email		string 		`gorm:"size:100;not null;unique"`
	Password 	string 		`gorm:"not null" json:"-"`
	Role 		RoleType   	`gorm:"type:varchar(20);not null;default:jobseeker"`
	CompanyId 	*uint 		`gorm:"default:null"`
	Applications []Applications `gorm:"foreignKey:UserId;reference:ID"`	
}

