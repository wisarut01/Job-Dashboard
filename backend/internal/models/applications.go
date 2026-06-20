package models

import "gorm.io/gorm"

type StatusJob string

const (
	Pending 	StatusJob = "pending"
	Accepted 	StatusJob = "accepted"
	Rejected 	StatusJob = "rejected"
)

type Applications struct {
	gorm.Model
	UserId uint	`gorm:"not null"`
	JobId  uint `gorm:"not null"`
	Status StatusJob `gorm:"type:varchar(20);not null;default:pending"`
}