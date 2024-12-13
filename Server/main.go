package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/shewwd/Todo-App/pkg/database"
	"github.com/shewwd/Todo-App/pkg/middleware"
	"github.com/shewwd/Todo-App/pkg/router"
)

func main() {

	err := database.Init()
	if err != nil {
		log.Fatalf("Failed to initialize the database: %v", err)
	}
	defer database.Close()
	log.Println("Database successfully initialized")

	router := router.Init()

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Printf("Listening on Port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, middleware.EnableCORS(router)))
}
