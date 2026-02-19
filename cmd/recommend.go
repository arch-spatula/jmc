package cmd

import "fmt"

var mockRestaurantList = []string{
	"식당1",
	"식당2",
	"식당3",
	"식당4",
	"식당5",
}

// 식당 목록을 추천함
func Recommend() {
	// TODO: 식당 목록은 파일에서 읽어옴
	// 식당 목록은 쉼표로 구분된 문자열로 저장됨
	// 식당 목록은 랜덤으로 추천함
	// 만약 식당 목록이 없으면 오류를 출력함
	// 식당 목록은 출력함
	fmt.Println("Recommend")
}
