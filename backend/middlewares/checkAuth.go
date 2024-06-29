package middlewares

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"main/initializers"
	"main/models"
	"net/http"
	"os"
	"strings"
	"time"
)

func CheckAuth(context *gin.Context) {
	authHeader := context.GetHeader("Authorization")

	if authHeader == "" {
		context.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is missing"})
		context.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	authToken := strings.Split(authHeader, " ")
	if len(authToken) != 2 || authToken[0] != "Bearer" {
		context.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token format"})
		context.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	tokenString := authToken[1]
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("SECRET")), nil
	})

	if err != nil || !token.Valid {
		context.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
		context.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		context.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		context.Abort()
		return
	}

	if float64(time.Now().Unix()) > claims["exp"].(float64) {
		context.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "token expired"})
		context.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	var user models.User
	initializers.DB.Where("ID=?", claims["id"]).Find(&user)

	if user.ID == 0 {
		context.AbortWithStatus(http.StatusUnauthorized)
		return
	}
	context.Set("currentUser", user)
	context.Next()
}
