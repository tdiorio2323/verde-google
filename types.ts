
export enum Category {
  FLOWER = "Flower",
  PRE_PACKAGED = "Pre-Packaged Flower",
  EDIBLES = "Edibles",
  CONCENTRATE = "Concentrate",
  DISPOSABLES = "Disposables",
  MERCH = "Merch",
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  imageUrl: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  user: User;
  orderDate: Date;
}