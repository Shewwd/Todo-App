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
	ID          int64  `json:"ID" db:"id"`
	Name        string `json:"Name" db:"name"`
	Description string `json:"Description" db:"description"`
}

var TABLE_NAME = "todo_item"

func Create(w http.ResponseWriter, r *http.Request) {
	// extract object from response body
	var newTodo TodoItem
	err := json.NewDecoder(r.Body).Decode(&newTodo)

	if err != nil || newTodo.Name == "" || newTodo.Description == "" {
		http.Error(w, "Invalid input: name and description are required", http.StatusBadRequest)
		return
	}

	id, err := database.Insert(TABLE_NAME, newTodo)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to add TODO item: %v", err), http.StatusBadRequest)
		return
	}
	newTodo.ID = id

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newTodo)
}

func GetAll(w http.ResponseWriter, r *http.Request) {
	var todoItems []TodoItem
	err := database.GetTable(TABLE_NAME, &todoItems)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to retrieve TODO items: %v", err), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todoItems)
}

func Update(w http.ResponseWriter, r *http.Request) {
	// extract object from response body
	var updatedTodo TodoItem
	err := json.NewDecoder(r.Body).Decode(&updatedTodo)
	if err != nil || updatedTodo.Name == "" || updatedTodo.Description == "" {
		http.Error(w, "Invalid input: name and description are required", http.StatusBadRequest)
		return
	}

	rowsAffected, err := database.Update(TABLE_NAME, updatedTodo)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to update TODO item: %v", err), http.StatusInternalServerError)
		return
	}

	// check if the item was updated
	if rowsAffected == 0 {
		http.Error(w, "TODO item not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updatedTodo)
}

func Delete(w http.ResponseWriter, r *http.Request) {
	// extract ID from URL
	idParam := mux.Vars(r)["id"]
	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil {
		http.Error(w, "Invalid ID: must be a positive integer", http.StatusBadRequest)
		return
	}

	rowsAffected, err := database.DeleteByID(TABLE_NAME, id)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to delete TODO item: %v", err), http.StatusInternalServerError)
		return
	}

	// check if the item was deleted
	if rowsAffected == 0 {
		http.Error(w, "TODO item not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
