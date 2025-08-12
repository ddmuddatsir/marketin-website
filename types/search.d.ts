import { ProductBase } from "./product";

export interface SearchResponse {
  products: ProductBase[];
  total: number;
  skip: number;
  limit: number;
}
