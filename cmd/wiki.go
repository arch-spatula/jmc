package cmd

import (
	"embed"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/arch-spatula/jmc/internal/restaurant"
)

//go:embed wiki/*
var wikiFiles embed.FS

type statusRecorder struct {
	http.ResponseWriter
	statusCode int
}

func (r *statusRecorder) WriteHeader(code int) {
	r.statusCode = code
	r.ResponseWriter.WriteHeader(code)
}

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		rec := &statusRecorder{ResponseWriter: w, statusCode: http.StatusOK}

		next.ServeHTTP(rec, r)

		log.Printf("%s %s %d %s", r.Method, r.URL.Path, rec.statusCode, time.Since(start))
	})
}

func Wiki() {
	fmt.Println("위키 서버가 시작되었습니다. http://localhost:8080 에서 접속해주세요.")

	repo := restaurant.NewRepository("data.json")
	service := restaurant.NewService(repo)
	controller := restaurant.NewController(service, wikiFiles)

	mux := http.NewServeMux()
	mux.HandleFunc("/", controller.HandlePage)
	mux.Handle("/static/", controller.StaticFiles(wikiFiles))
	mux.HandleFunc("GET /api/restaurants", controller.HandleGetAll)
	mux.HandleFunc("GET /api/restaurants/recommend", controller.HandleRecommend)
	mux.HandleFunc("POST /api/restaurants", controller.HandleCreate)
	mux.HandleFunc("PUT /api/restaurants/{name}", controller.HandleUpdate)
	mux.HandleFunc("DELETE /api/restaurants/{name}", controller.HandleDelete)
	mux.HandleFunc("POST /api/restaurants/save", controller.HandleSave)

	http.ListenAndServe(":8080", loggingMiddleware(mux))
}
