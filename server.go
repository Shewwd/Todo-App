package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

var db *sql.DB

type TodoItem struct {
	ID          int64  `json:"ID"`
	Name        string `json:"Name"`
	Description string `json:"Description"`
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Allow all origins (you can restrict this to your frontend's origin)
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// Handle preflight request
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	router := mux.NewRouter()

	// Define endpoints
	router.HandleFunc("/todoitem", createTodoItem).Methods("POST")
	router.HandleFunc("/todoitem", getTodoItems).Methods("GET")
	router.HandleFunc("/todoitem/{id}", updateTodoItem).Methods("PUT")
	router.HandleFunc("/todoitem/{id}", deleteTodoItem).Methods("DELETE")

	fmt.Println("Listening on Port 8080")

	// Capture connection properties
	cfg := mysql.Config{
		User:   os.Getenv("DBUSER"),
		Passwd: os.Getenv("DBPASS"),
		Net:    "tcp",
		Addr:   "127.0.0.1:3306",
		DBName: "todo_db",
	}

	// Get a database handle
	db, err = sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		log.Fatal(err)
	}

	pingErr := db.Ping()
	if pingErr != nil {
		log.Fatal(pingErr)
	}

	log.Fatal(http.ListenAndServe(":8080", enableCORS(router)))
}

// Create a TODO item
func createTodoItem(w http.ResponseWriter, r *http.Request) {
	var newTodo TodoItem

	err := json.NewDecoder(r.Body).Decode(&newTodo)
	if err != nil || newTodo.Name == "" || newTodo.Description == "" {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	result, err := db.Exec("INSERT INTO todo_item (name, description) VALUES (?, ?)", newTodo.Name, newTodo.Description)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error adding new Todo item: %v", err), http.StatusBadRequest)
		return
	}
	id, err := result.LastInsertId()
	if err != nil {
		http.Error(w, fmt.Sprintf("Error adding new Todo item: %v", err), http.StatusBadRequest)
	}
	newTodo.ID = id

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newTodo)
}

// Get all TODO items
func getTodoItems(w http.ResponseWriter, r *http.Request) {
	var todoItems []TodoItem

	rows, err := db.Query("SELECT * FROM todo_item")
	if err != nil {
		http.Error(w, fmt.Sprintf("Error getting todo items: %v", err), http.StatusBadRequest)
		return
	}
	defer rows.Close()
	// Loop through rows, using Scan to assign column data to struct fields.
	for rows.Next() {
		var todoItem TodoItem
		if err := rows.Scan(&todoItem.ID, &todoItem.Name, &todoItem.Description); err != nil {
			http.Error(w, fmt.Sprintf("Error scanning todo item row: %v", err), http.StatusBadRequest)
		}
		todoItems = append(todoItems, todoItem)
	}
	if err := rows.Err(); err != nil {
		http.Error(w, fmt.Sprintf("Error getting todo items: %v", err), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todoItems)
}

// Update a TODO item
func updateTodoItem(w http.ResponseWriter, r *http.Request) {
	var updatedTodo TodoItem
	err := json.NewDecoder(r.Body).Decode(&updatedTodo)
	if err != nil || updatedTodo.Name == "" || updatedTodo.Description == "" {
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

	// Update the TODO item in the database
	result, err := db.Exec("UPDATE todo_item SET name = ?, description = ? WHERE id = ?", updatedTodo.Name, updatedTodo.Description, id)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error updating TODO item: %v", err), http.StatusInternalServerError)
		return
	}

	// Check if the item was updated
	rowsAffected, err := result.RowsAffected()
	if err != nil || rowsAffected == 0 {
		http.Error(w, "TODO item not found", http.StatusNotFound)
		return
	}

	updatedTodo.ID = int64(id)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updatedTodo)
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

	// Delete the TODO item from the database
	result, err := db.Exec("DELETE FROM todo_item WHERE id = ?", id)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error deleting TODO item: %v", err), http.StatusInternalServerError)
		return
	}

	// Check if the item was deleted
	rowsAffected, err := result.RowsAffected()
	if err != nil || rowsAffected == 0 {
		http.Error(w, "TODO item not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent) // No content response
}
