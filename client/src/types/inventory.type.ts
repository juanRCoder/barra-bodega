export type ProductData = {
  id: string;
  productId: string;
  code: string;
  name: string;
  price: number;
  unit: string;
  stock: number;
};

export type ProductsResponse = {
  products: ProductData[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  summary: {
    totalProducts: number;
    restockCount: number;
  };
};

export type NewProductForm = {
  code: string;
  name: string;
  price: number;
  stock: number;
};

export type UpdateProductForm = Pick<ProductData, 'price' | 'stock'>;
