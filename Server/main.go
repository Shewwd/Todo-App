package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/shewwd/Todo-App/pkg/database"
	"github.com/shewwd/Todo-App/pkg/router"
)

func main() {

	database.InitDB()

	router := router.InitRouter()

	fmt.Println("Listening on Port 8080")
	log.Fatal(http.ListenAndServe(":8080", middleware.enableCORS(router)))
}
