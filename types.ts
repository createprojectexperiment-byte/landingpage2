export interface Product {
  id: string;
  created_at: string;
  title: string;
  price: string;
  oldPrice: string;
  description: string;
  image: string;
  lynkUrl: string;
  position: number;
}

export interface Testimonial {
  id: string;
  created_at: string;
  name: string;
  role: string;
  text: string;
  image: string;
  position: number;
}
