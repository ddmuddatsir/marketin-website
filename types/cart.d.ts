export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  price: number;
  name?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: string;
    title: string;
    image?: string;
    thumbnail?: string;
    images?: string[];
    price: number;
    brand?: string;
    category?: string;
    description?: string;
  };
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TabContentProps {
  title: string;
  description: string;
  children: ReactNode;
}

export type CartItemEntity = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
};

export type RawCartItemEntity = {
  productId?: string;
  id?: string;
  quantity?: number;
  price?: number;
  name?: string;
  image?: string;
};

export type CartResponse = {
  carts: Cart[];
  total: number;
  skip: number;
  limit: number;
};
