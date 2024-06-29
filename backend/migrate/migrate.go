package main

import (
	"log"
	"main/initializers"
	"main/models"
)

func init() {
	initializers.LoadEnvs()
	initializers.ConnectDB()
}

func main() {
	err := initializers.DB.AutoMigrate(&models.User{})
	if err != nil {
		log.Fatal("Error migration", err)
	}
}
