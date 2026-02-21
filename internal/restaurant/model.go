package restaurant

import "fmt"

type Restaurant struct {
	Name       string   `json:"name"`
	Rating     float64  `json:"rating"`
	Categories []string `json:"categories"`
	KakaoURL   string   `json:"kakao_url"`
	Visited    bool     `json:"visited"`
}

func (r *Restaurant) Validate() error {
	if r.Name == "" {
		return fmt.Errorf("name은 필수입니다")
	}
	if r.Rating < 0 || r.Rating > 5 {
		return fmt.Errorf("rating은 0~5 사이여야 합니다: %s", r.Name)
	}
	if r.Rating*2 != float64(int(r.Rating*2)) {
		return fmt.Errorf("rating은 0.5 단위여야 합니다: %s", r.Name)
	}
	if len(r.Categories) == 0 {
		return fmt.Errorf("categories는 최소 1개 필요합니다: %s", r.Name)
	}
	if r.KakaoURL == "" {
		return fmt.Errorf("kakao_url은 필수입니다: %s", r.Name)
	}
	return nil
}

func (d *RestaurantData) Validate() error {
	if d.Restaurants == nil {
		return fmt.Errorf("restaurants 필드가 없습니다")
	}
	for i, r := range d.Restaurants {
		if err := r.Validate(); err != nil {
			return fmt.Errorf("restaurants[%d]: %w", i, err)
		}
	}
	return nil
}

type RestaurantData struct {
	Restaurants []Restaurant   `json:"restaurants"`
	Config      map[string]any `json:"config"`
}

type SaveRequest struct {
	New    []Restaurant `json:"new"`
	Update []Restaurant `json:"update"`
	Delete []string     `json:"delete"`
}
