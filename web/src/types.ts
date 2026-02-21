export interface Restaurant {
  name: string;
  rating: string;
  categories: string[];
  kakao_url: string;
  visited: boolean;
}

export interface SavePayload {
  new: Restaurant[];
  update: Restaurant[];
  delete: string[];
}
