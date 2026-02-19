package restaurant

type Restaurant struct {
	Name       string   `json:"name"`
	Rating     string   `json:"rating"`
	Categories []string `json:"categories"`
	KakaoURL   string   `json:"kakao_url"`
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
