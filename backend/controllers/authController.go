package controllers

import (
	"main/initializers"
	"main/models"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func CreateUser(context *gin.Context) {
	var authInputRegister models.AuthInputRegister

	if err := context.ShouldBindJSON(&authInputRegister); err != nil {
		context.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var userFound models.User

	initializers.DB.Where("user_name=?", authInputRegister.UserName).Find(&userFound)
	if userFound.ID != 0 {
		context.IndentedJSON(http.StatusBadRequest, gin.H{"error": "username already used"})
		return
	}

	initializers.DB.Where("email=?", authInputRegister.Email).Find(&userFound)
	if userFound.ID != 0 {
		context.IndentedJSON(http.StatusBadRequest, gin.H{"error": "email already used"})
		return
	}

	initializers.DB.Where("phone_number=?", authInputRegister.PhoneNumber).Find(&userFound)
	if userFound.ID != 0 {
		context.IndentedJSON(http.StatusBadRequest, gin.H{"error": "phone number already used"})
		return
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(authInputRegister.Password), bcrypt.DefaultCost)

	if err != nil {
		context.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := models.User{
		UserName:    authInputRegister.UserName,
		Email:       authInputRegister.Email,
		PhoneNumber: authInputRegister.PhoneNumber,
		Password:    string(passwordHash),
	}

	initializers.DB.Create(&user)
	context.IndentedJSON(http.StatusOK, gin.H{
		"status":  true,
		"message": "you registered successfully",
		"data":    user,
	})
}

func Login(context *gin.Context) {
	var authInput models.AuthInput

	if err := context.ShouldBindJSON(&authInput); err != nil {
		context.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var userFound models.User
	initializers.DB.Where("email=?", authInput.Email).Find(&userFound)

	if userFound.ID == 0 {
		context.IndentedJSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(userFound.Password), []byte(authInput.Password)); err != nil {
		context.IndentedJSON(http.StatusBadRequest, gin.H{"error": "invalid password"})
	}

	generateToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":  userFound.ID,
		"exp": time.Now().Add(time.Hour * 24).Unix(),
	})

	token, err := generateToken.SignedString([]byte(os.Getenv("SECRET")))

	if err != nil {
		context.IndentedJSON(http.StatusBadRequest, gin.H{"error": "failed to generate token"})
	}

	context.IndentedJSON(http.StatusOK, gin.H{
		"status":  true,
		"data":    userFound,
		"message": "You have successfully logged in",
		"token":   token,
	})
}

func GetUserProfile(context *gin.Context) {
	user, _ := context.Get("currentUser")

	context.IndentedJSON(http.StatusOK, gin.H{
		"status": true,
		"data":   user,
	})
}
