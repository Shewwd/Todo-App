package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"reflect"
	"strings"

	"github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

var db *sql.DB

func InitDB() {
	// get .env variables
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	// db connection properties
	cfg := mysql.Config{
		User:   os.Getenv("DBUSER"),
		Passwd: os.Getenv("DBPASS"),
		Net:    "tcp",
		Addr:   "127.0.0.1:3306",
		DBName: "todo_db",
	}

	// open database
	db, err = sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		log.Fatal(err)
	}

	// verrify db connection
	pingErr := db.Ping()
	if pingErr != nil {
		log.Fatal(pingErr)
	}
}

func Insert(tableName string, input interface{}) (int64, error) {
	// Use reflection to iterate over input fields
	val := reflect.ValueOf(input)
	if val.Kind() != reflect.Struct {
		return 0, fmt.Errorf("input must be a struct")
	}

	// Collect field names and placeholders
	var fields []string
	var placeholders []string
	var values []interface{}

	for i := 0; i < val.NumField(); i++ {
		field := val.Type().Field(i)
		fieldName := field.Name
		fieldValue := val.Field(i).Interface()

		fields = append(fields, fieldName)
		placeholders = append(placeholders, "?")
		values = append(values, fieldValue)
	}

	// Build the SQL statement
	fieldList := strings.Join(fields, ", ")
	placeholderList := strings.Join(placeholders, ", ")
	query := fmt.Sprintf("INSERT INTO %s (%s) VALUES (%s)", tableName, fieldList, placeholderList)

	// Execute the query
	result, err := db.Exec(query, values...)
	if err != nil {
		return 0, err
	}

	// Return the last inserted ID
	return result.LastInsertId()
}

func GetTable(tableName)
