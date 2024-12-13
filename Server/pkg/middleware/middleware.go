package middleware

import (
	"log"
	"net/http"
	"os"
)

func EnableCORS(next http.Handler) http.Handler {
	allowedOrigin := os.Getenv("CORS_ORIGIN")
	if allowedOrigin == "" {
		developmentOrigin := "http://localhost:5173"
		log.Println("No CORS_ORIGIN .env variable found defaulting to development origin - %s", developmentOrigin)
		allowedOrigin = developmentOrigin
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			log.Println("Preflight request handled")
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
