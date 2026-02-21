APP_NAME := jmc

.PHONY: build build-web run clean test test-web

build-web:
	cd web && pnpm run build
	cp web/template/index.html cmd/wiki/index.html

build: build-web
	go build -o $(APP_NAME) .

run: build
	./$(APP_NAME) wiki

test-web:
	cd web && pnpm test

test: test-web
	go test ./... -v

clean:
	rm -f $(APP_NAME)
	rm -rf cmd/wiki/
