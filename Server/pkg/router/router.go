package router

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/shewwd/Todo-App/pkg/models/todoitem"
)

func Init() *mux.Router {
	router := mux.NewRouter().PathPrefix("/api").Subrouter()

	// Define endpoints
	router.HandleFunc("/todoitem/create", todoitem.Create).Methods("POST")
	router.HandleFunc("/todoitem/getall", todoitem.GetAll).Methods("GET")
	router.HandleFunc("/todoitem/update/{id}", todoitem.Update).Methods("PUT")
	router.HandleFunc("/todoitem/delete/{id}", todoitem.Delete).Methods("DELETE")

	// Handle undefined routes
	router.NotFoundHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.Error(w, "Route not found", http.StatusNotFound)
	})

	return router
}
