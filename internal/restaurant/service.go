package restaurant

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetAll() (*RestaurantData, error) {
	return s.repo.FindAll()
}

func (s *Service) Create(item Restaurant) error {
	return s.repo.Create(item)
}

func (s *Service) Update(name string, item Restaurant) error {
	return s.repo.Update(name, item)
}

func (s *Service) Delete(name string) error {
	return s.repo.Delete(name)
}

func (s *Service) SaveBatch(req SaveRequest) (*RestaurantData, error) {
	return s.repo.SaveBatch(req)
}
