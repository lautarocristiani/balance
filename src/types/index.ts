export interface Product {
  id: number;
  created_at: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
}