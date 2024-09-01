export type AddToCartBody = {
  productId: number;
  quantity: number;
};

export type DeleteProductCart = {
  productId: number;
};

export type UpdateBody = {
  productId: number;
  quantity: number;
};
export type ResponseStock = {
  rc: number;
  success: boolean;
  message: string;
  result: {
    stock: number;
  };
};
