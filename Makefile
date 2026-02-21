APP_NAME := jmc

.PHONY: build run clean test

build:
	go build -o $(APP_NAME) .

run:
	go run .

test:
	go test ./... -v

clean:
	rm -f $(APP_NAME)