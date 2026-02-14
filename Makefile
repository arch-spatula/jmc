APP_NAME := jmc

.PHONY: build run clean

build:
	go build -o $(APP_NAME) .

run:
	go run .

clean:
	rm -f $(APP_NAME)