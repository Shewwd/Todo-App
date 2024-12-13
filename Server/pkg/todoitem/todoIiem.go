package todoitem

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/shewwd/Todo-App/pkg/database"
)

type TodoItem struct {
	ID          int64  `json:"ID"`
	Name        string `json:"Name"`
	Description string `json:"Description"`
}

// Create a TODO item
func Create(w http.ResponseWriter, r *http.Request) {
	var newTodo TodoItem
	err := json.NewDecoder(r.Body).Decode(&newTodo)

	if err != nil || newTodo.Name == "" || newTodo.Description == "" {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	id, err := database.Insert("todo_item", newTodo)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error adding new Todo item: %v", err), http.StatusBadRequest)
		return
	}
	newTodo.ID = id

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newTodo)
}

// Get all TODO items
func GetAll(w http.ResponseWriter, r *http.Request) {
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
func Update(w http.ResponseWriter, r *http.Request) {
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
func Delete(w http.ResponseWriter, r *http.Request) {
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
