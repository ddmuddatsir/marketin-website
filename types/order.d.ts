import { Product } from "./product";
import { Address } from "./user";

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  name: string; // Nama produk dari order data
  productId?: string;
  productData?: Product; // Data produk dari DummyJSON
}
export interface Order {
  id: string;
  status: string;
  createdAt: string;
  total?: number;
  totalAmount?: number;
  items: OrderItem[];
}

export interface OrderDetail {
  id: string;
  status: string;
  total: number;
  paymentMethod: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  items: OrderItem[];
  shippingAddress: Address;
}
