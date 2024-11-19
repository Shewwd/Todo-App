package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

type TodoItem struct {
	ID int `json:"id"`
}

var todoItems []TodoItem

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/todoitem", createTodoItem).Methods("POST")

	// Add a route for OPTIONS requests to handle CORS preflight
	router.Methods("OPTIONS").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "https://special-yodel-gw6jq76x7rp3v549-5173.app.github.dev")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.WriteHeader(http.StatusNoContent)
	})

	// Set up CORS with Allowed Origins and Headers
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"https://special-yodel-gw6jq76x7rp3v549-5173.app.github.dev"}), // Your frontend origin
		handlers.AllowedMethods([]string{"GET", "POST", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type"}),
	)

	// Wrap the router with CORS handling middleware
	log.Fatal(http.ListenAndServe(":8080", corsHandler(router)))
}

func createTodoItem(w http.ResponseWriter, r *http.Request) {
	fmt.Println("createTodoItem")
	var newTodoItem TodoItem
	newTodoItem.ID = len(todoItems) + 1
	_ = json.NewDecoder(r.Body).Decode(&newTodoItem)
	todoItems = append(todoItems, newTodoItem)
	w.Header().Set("Access-Control-Allow-Origin", "https://special-yodel-gw6jq76x7rp3v549-5173.app.github.dev")
	json.NewEncoder(w).Encode(newTodoItem)
}
