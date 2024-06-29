package models

import "time"

type User struct {
	ID          uint      `json:"id" gorm:"primary_key"`
	UserName    string    `json:"userName" gorm:"unique"`
	PhoneNumber string    `json:"phoneNumber" gorm:"unique"`
	Email       string    `json:"email" gorm:"unique"`
	Password    string    `json:"password"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}
