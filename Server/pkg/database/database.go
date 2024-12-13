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

func Init() error {
	// Load .env variables
	err := godotenv.Load()
	if err != nil {
		return fmt.Errorf("Warning: .env file not found. Using environment variables instead.")
	}

	// Database connection properties
	cfg := mysql.Config{
		User:   os.Getenv("DBUSER"),
		Passwd: os.Getenv("DBPASS"),
		Net:    "tcp",
		Addr:   "127.0.0.1:3306",
		DBName: "todo_db",
	}

	// Open database
	db, err = sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		return fmt.Errorf("Error opening database: %w", err)
	}

	// Verify connection
	if err := db.Ping(); err != nil {
		return fmt.Errorf("Error verifying connection: %w", err)
	}

	// Set connection pool options
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * 60) // 5 minutes

	return nil
}

func Close() {
	if db != nil {
		db.Close()
		log.Println("Database connection closed")
	}
}

func Insert(tableName string, input interface{}) (int64, error) {
	// Loop over input reflect and get struct field to db mapping
	val := reflect.ValueOf(input)
	if val.Kind() != reflect.Struct {
		return 0, fmt.Errorf("Input must be a struct")
	}
	var fields []string
	var placeholders []string
	var values []interface{}
	for i := 0; i < val.NumField(); i++ {
		field := val.Type().Field(i)
		dbTag := field.Tag.Get("db")

		// Skip the 'id' field on creation
		if dbTag == "id" {
			continue
		}

		if dbTag == "" {
			return 0, fmt.Errorf("Struct Field %s has no db tag")
		}
		fieldValue := val.Field(i).Interface()

		fields = append(fields, dbTag)
		placeholders = append(placeholders, "?")
		values = append(values, fieldValue)
	}

	// Build and execute SQL query
	fieldList := strings.Join(fields, ", ")
	placeholderList := strings.Join(placeholders, ", ")
	query := fmt.Sprintf("INSERT INTO %s (%s) VALUES (%s)", tableName, fieldList, placeholderList)

	result, err := db.Exec(query, values...)
	if err != nil {
		return 0, err
	}

	// Return the last inserted ID
	return result.LastInsertId()
}

func GetTable(tableName string, output interface{}) error {
	// Validate the output is a pointer to a slice
	val := reflect.ValueOf(output)
	if val.Kind() != reflect.Ptr || val.Elem().Kind() != reflect.Slice {
		return fmt.Errorf("Output must be a pointer to a slice")
	}

	// Build and execute SQL query
	query := fmt.Sprintf("SELECT * FROM %s", tableName)
	rows, err := db.Query(query)
	if err != nil {
		return err
	}
	defer rows.Close()

	// Get column names from the query result
	columns, err := rows.Columns()
	if err != nil {
		return err
	}

	// Prepare a slice of interfaces to hold row data
	for rows.Next() {
		rowValues := make([]interface{}, len(columns))
		rowPointers := make([]interface{}, len(columns))
		for i := range rowValues {
			rowPointers[i] = &rowValues[i]
		}

		// Scan the row into rowPointers
		if err := rows.Scan(rowPointers...); err != nil {
			return err
		}

		// Map row data to the struct
		rowStruct := reflect.New(val.Elem().Type().Elem()).Interface()
		rowValue := reflect.ValueOf(rowStruct).Elem()
		for i, column := range columns {
			for j := 0; j < rowValue.NumField(); j++ {
				field := rowValue.Type().Field(j)
				dbTag := field.Tag.Get("db")
				if dbTag == column {
					fieldValue := rowValue.Field(j)
					if fieldValue.IsValid() && fieldValue.CanSet() {
						fieldValue.Set(reflect.ValueOf(rowValues[i]).Convert(fieldValue.Type()))
					}
					break
				}
			}
		}

		// Append the struct to the output slice
		val.Elem().Set(reflect.Append(val.Elem(), rowValue))
	}

	return rows.Err()
}

func Update(tableName string, input interface{}) (int64, error) {
	// Use reflection to iterate over input fields
	val := reflect.ValueOf(input)
	if val.Kind() != reflect.Struct {
		return 0, fmt.Errorf("Input must be a struct")
	}

	// Collect fields and their values for the SET clause
	var id int64
	var updates []string
	var values []interface{}
	for i := 0; i < val.NumField(); i++ {
		field := val.Type().Field(i)
		dbTag := field.Tag.Get("db")
		if dbTag == "" {
			continue
		}
		fieldValue := val.Field(i).Interface()

		if dbTag == "id" { // Identify primary key
			if idValue, ok := fieldValue.(int64); ok {
				id = idValue
			} else {
				return 0, fmt.Errorf("ID field must be of type int64")
			}
			continue
		}

		updates = append(updates, fmt.Sprintf("%s = ?", dbTag))
		values = append(values, fieldValue)
	}

	// Build the SQL query
	updateClause := strings.Join(updates, ", ")
	query := fmt.Sprintf("UPDATE %s SET %s WHERE id = ?", tableName, updateClause)

	// Append the ID to the values slice
	values = append(values, id)

	// Execute the query
	result, err := db.Exec(query, values...)
	if err != nil {
		return 0, err
	}

	// Return the number of rows affected
	return result.RowsAffected()
}

func DeleteByID(tableName string, id int64) (int64, error) {
	// Build and execute SQL query
	query := fmt.Sprintf("DELETE FROM %s WHERE id = ?", tableName)
	result, err := db.Exec(query, id)
	if err != nil {
		return 0, err
	}

	// Return the number of rows affected
	return result.RowsAffected()
}
