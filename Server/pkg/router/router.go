package router

import (
	"github.com/gorilla/mux"
)

func InitRouter() *mux.Router {
	router := mux.NewRouter()

	// Define endpoints
	router.HandleFunc("/todoitem", todoitem.).Methods("POST")
	router.HandleFunc("/todoitem", getTodoItems).Methods("GET")
	router.HandleFunc("/todoitem/{id}", updateTodoItem).Methods("PUT")
	router.HandleFunc("/todoitem/{id}", deleteTodoItem).Methods("DELETE")

	return router
}
