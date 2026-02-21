package restaurant

import (
	"encoding/json"
	"os"
	"testing"
)

func TestRestaurantValidate_MissingName(t *testing.T) {
	r := Restaurant{Rating: 3, Categories: []string{"한식"}, KakaoURL: "https://example.com"}
	if err := r.Validate(); err == nil {
		t.Fatal("name이 없는데 에러가 발생하지 않음")
	}
}

func TestRestaurantValidate_RatingOutOfRange(t *testing.T) {
	r := Restaurant{Name: "테스트", Rating: -1, Categories: []string{"한식"}, KakaoURL: "https://example.com"}
	if err := r.Validate(); err == nil {
		t.Fatal("rating이 범위 밖인데 에러가 발생하지 않음")
	}

	r.Rating = 5.5
	if err := r.Validate(); err == nil {
		t.Fatal("rating이 5 초과인데 에러가 발생하지 않음")
	}
}

func TestRestaurantValidate_RatingNotHalfStep(t *testing.T) {
	r := Restaurant{Name: "테스트", Rating: 2.3, Categories: []string{"한식"}, KakaoURL: "https://example.com"}
	if err := r.Validate(); err == nil {
		t.Fatal("rating이 0.5 단위가 아닌데 에러가 발생하지 않음")
	}
}

func TestRestaurantValidate_EmptyCategories(t *testing.T) {
	r := Restaurant{Name: "테스트", Rating: 3, Categories: []string{}, KakaoURL: "https://example.com"}
	if err := r.Validate(); err == nil {
		t.Fatal("빈 categories인데 에러가 발생하지 않음")
	}
}

func TestRestaurantValidate_MissingKakaoURL(t *testing.T) {
	r := Restaurant{Name: "테스트", Rating: 3, Categories: []string{"한식"}}
	if err := r.Validate(); err == nil {
		t.Fatal("kakao_url이 없는데 에러가 발생하지 않음")
	}
}

func TestRestaurantValidate_Valid(t *testing.T) {
	r := Restaurant{Name: "테스트", Rating: 4.5, Categories: []string{"한식"}, KakaoURL: "https://example.com"}
	if err := r.Validate(); err != nil {
		t.Fatalf("유효한 데이터인데 에러 발생: %v", err)
	}
}

func TestRestaurantValidate_ZeroRating(t *testing.T) {
	r := Restaurant{Name: "테스트", Rating: 0, Categories: []string{"한식"}, KakaoURL: "https://example.com"}
	if err := r.Validate(); err != nil {
		t.Fatalf("rating 0은 유효한데 에러 발생: %v", err)
	}
}

func TestRestaurantDataValidate_NilRestaurants(t *testing.T) {
	d := RestaurantData{Restaurants: nil}
	if err := d.Validate(); err == nil {
		t.Fatal("restaurants가 nil인데 에러가 발생하지 않음")
	}
}

func TestDataJSON(t *testing.T) {
	raw, err := os.ReadFile("../../data.json")
	if err != nil {
		t.Fatalf("data.json 읽기 실패: %v", err)
	}

	var data RestaurantData
	if err := json.Unmarshal(raw, &data); err != nil {
		t.Fatalf("data.json 파싱 실패: %v", err)
	}

	if err := data.Validate(); err != nil {
		t.Fatalf("data.json 검증 실패: %v", err)
	}
}
