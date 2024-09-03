// types.ts
export interface Warehouse {
  id: number;
  name: string;
}

export interface ProductStock {
  id: number;
  stock: number;
  warehouse: Warehouse;
}

export interface Category {
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  productStocks: ProductStock[];
  category: Category;
  slug: string;
  productImages: { url: string }[];
}
