package cmd

import (
	"fmt"
	"math/rand"
	"os"
	"time"

	"github.com/arch-spatula/jmc/internal/restaurant"
)

// 식당 목록을 추천함
func Recommend() {
	// TODO: 식당 목록은 파일에서 읽어옴
	repo := restaurant.NewRepository("data.json")
	data, err := repo.FindAll()
	if err != nil {
		fmt.Fprintf(os.Stderr, "식당 목록 읽기 실패: %v\n", err)
		os.Exit(1)
	}

	// 식당 목록은 랜덤으로 추천함
	source := rand.NewSource(time.Now().UnixNano())
	r := rand.New(source)
	randomIndex := r.Intn(len(data.Restaurants))

	fmt.Printf("%s %.1f %s %s\n", data.Restaurants[randomIndex].Name, data.Restaurants[randomIndex].Rating, data.Restaurants[randomIndex].Categories, data.Restaurants[randomIndex].KakaoURL)
}
