package cmd

import (
	"embed"
	"fmt"
	"io/fs"
	"net/http"
)

//go:embed wiki/*
var wikiFiles embed.FS

func Wiki() {
	fmt.Println("위키 서버가 시작되었습니다. http://localhost:8080 에서 접속해주세요.")

	subFS, _ := fs.Sub(wikiFiles, "wiki")
	mux := http.NewServeMux()
	mux.Handle("/", http.FileServer(http.FS(subFS)))

	http.ListenAndServe(":8080", mux)
}
