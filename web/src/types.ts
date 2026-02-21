export interface Menu {
  name: string;
  rating: number;
  price: number;
  description: string;
}

export interface Restaurant {
  name: string;
  rating: number;
  categories: string[];
  kakao_url: string;
  visited: boolean;
  description: string;
  menus: Menu[];
}

export interface SavePayload {
  new: Restaurant[];
  update: Restaurant[];
  delete: string[];
}
