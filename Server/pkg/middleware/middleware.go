package middleware

import (
	"log"
	"net"
	"net/http"
	"strings"
)

func EnableCORS(next http.Handler) http.Handler {
	allowedOrigins := getAllowedOrigins()
	log.Printf("Allowed origins: %s", allowedOrigins)

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")

		// If the Origin header is present, check if it matches an allowed origin
		if origin != "" {
			// Check if the origin is in the list of allowed origins
			if isAllowedOrigin(origin, allowedOrigins) {
				w.Header().Set("Access-Control-Allow-Origin", origin)
			} else {
				log.Printf("Blocked CORS request from origin: %s", origin)
			}
		}

		// Set other CORS headers
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			// Handle preflight request
			log.Println("Preflight request handled")
			w.WriteHeader(http.StatusNoContent)
			return
		}

		// Continue to the next handler
		next.ServeHTTP(w, r)
	})
}

// getAllowedOrigins returns a slice of allowed origins for localhost and network access.
func getAllowedOrigins() []string {
	localIP := getLocalIP()
	localhostOrigin := "http://localhost:5173"
	networkOrigin := "http://" + localIP + ":5173"

	// Return a slice of allowed origins
	return []string{localhostOrigin, networkOrigin}
}

// isAllowedOrigin checks if the origin is in the allowed list of origins.
func isAllowedOrigin(origin string, allowedOrigins []string) bool {
	for _, allowedOrigin := range allowedOrigins {
		if origin == allowedOrigin {
			return true
		}
	}
	return false
}

// getLocalIP gets the local IP address of the machine for network access.
func getLocalIP() string {
	// Get all network interfaces on the machine
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		log.Fatal("Failed to get local IP address:", err)
	}

	// Look for an IPv4 address in the form of "192.168.x.x", "10.x.x.x", etc
	for _, addr := range addrs {
		ip := addr.String()
		if strings.Contains(ip, ":") {
			// Skip IPv6 addresses
			continue
		}

		// If the address is an IPv4 address, strip the network mask
		if strings.HasPrefix(ip, "192.") || strings.HasPrefix(ip, "10.") || strings.HasPrefix(ip, "172.") {
			// Strip out the network mask (e.g., "/24") if present
			ipParts := strings.Split(ip, "/")
			return ipParts[0]
		}
	}
	return "127.0.0.1"
}
