package main

import (
	"main/controllers"
	"main/initializers"
	"main/middlewares"

	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnvs()
	initializers.ConnectDB()
}

func main() {
	router := gin.Default()
	//router.GET("/info", func(context *gin.Context) {
	//	context.IndentedJSON(http.StatusOK, gin.H{"info": "it work"})
	//})
	router.Use(middlewares.CORSMiddleware())
	router.POST("auth/signup", controllers.CreateUser)
	router.POST("auth/signin", controllers.Login)
	router.GET("user/profile", middlewares.CheckAuth, controllers.GetUserProfile)
	router.Run()
}
