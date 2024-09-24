export type StockTransfer = {
  id: number;
  product: {
    id: number;
    name: string;
  };
  sourceWarehouse?: {
    id: number;
    name: string;
  };
  destinationWarehouse?: {
    id: number;
    name: string;
  };
  stockRequest: number;
  stockProcess?: number;
  note: string;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  destinationWarehouseId?: { id: number };
};

export type Warehouse = {
  id: number;
  name: string;
  location: string;
  createdAt: string;
  updatedAt: string;
};
