package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type TodoItem struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

var todoItems []TodoItem

func main() {
	router := mux.NewRouter()

	// Define endpoints
	router.HandleFunc("/todoitem", createTodoItem).Methods("POST")
	router.HandleFunc("/todoitem", getTodoItems).Methods("GET")
	router.HandleFunc("/todoitem/{id}", updateTodoItem).Methods("PUT")
	router.HandleFunc("/todoitem/{id}", deleteTodoItem).Methods("DELETE")

	log.Fatal(http.ListenAndServe(":8080", router))
}

// Create a TODO item
func createTodoItem(w http.ResponseWriter, r *http.Request) {
	var newTodo TodoItem

	err := json.NewDecoder(r.Body).Decode(&newTodo)
	if err != nil || newTodo.Name == "" {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// Generate a new ID
	if len(todoItems) > 0 {
		newTodo.ID = todoItems[len(todoItems)-1].ID + 1
	} else {
		newTodo.ID = 1
	}

	todoItems = append(todoItems, newTodo)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newTodo)
}

// Get all TODO items
func getTodoItems(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todoItems)
}

// Update a TODO item
func updateTodoItem(w http.ResponseWriter, r *http.Request) {
	var updatedTodo TodoItem
	err := json.NewDecoder(r.Body).Decode(&updatedTodo)
	if err != nil || updatedTodo.Name == "" {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// Extract ID from URL
	idParam := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idParam)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	// Find and update the TODO item
	for i, item := range todoItems {
		if item.ID == id {
			todoItems[i].Name = updatedTodo.Name
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(todoItems[i])
			return
		}
	}

	http.Error(w, "TODO item not found", http.StatusNotFound)
}

// Delete a TODO item
func deleteTodoItem(w http.ResponseWriter, r *http.Request) {
	// Extract ID from URL
	idParam := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idParam)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	// Find and delete the TODO item
	for i, item := range todoItems {
		if item.ID == id {
			todoItems = append(todoItems[:i], todoItems[i+1:]...)
			w.WriteHeader(http.StatusNoContent) // No content response
			return
		}
	}

	http.Error(w, "TODO item not found", http.StatusNotFound)
}
