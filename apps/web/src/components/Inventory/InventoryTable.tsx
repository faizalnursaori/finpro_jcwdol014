// @ts-nocheck

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { NewStock } from './ButtonAddStock';
import { deleteProductStock, getProductStock } from '@/api/inventory';
import { getWarehouses } from '@/api/warehouse';

interface Product {
  id: number;
  name: string;
}

interface Warehouse {
  id: number;
  name: string;
  userId: number;
}

interface ProductStock {
  productId: number;
  id: number;
  stock: number;
  warehouse: Warehouse;
}

interface ProductData {
  id: number;
  name: string;
  productStocks: ProductStock[];
}

export default function InventoryTable() {
  const { data } = useSession();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [sortedProducts, setSortedProducts] = useState<ProductStock[]>([]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [stockToDelete, setStockToDelete] = useState<{
    stockId: number;
    warehouseId: number;
    productId: number;
    stock: number;
  } | null>(null);

  const isSuperAdmin = data?.user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    const loadProductsAndWarehouses = async () => {
      try {
        const [fetchedProducts, fetchedWarehouses] = await Promise.all([
          getProductStock(),
          getWarehouses(),
        ]);
        setProducts(fetchedProducts);
        setWarehouses(fetchedWarehouses);
      } catch (error) {
        console.error(error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProductsAndWarehouses();
  }, []);

  useEffect(() => {
    const sorted = products
      .flatMap((product) =>
        product.productStocks.map((stock) => ({
          ...stock,
          productName: product.name,
        })),
      )
      .sort((a, b) => (a.warehouse.name > b.warehouse.name ? 1 : -1));

    setSortedProducts(sorted);
  }, [products]);

  useEffect(() => {
    const fetchWarehouseId = async () => {
      if (!isSuperAdmin && data?.user?.id) {
        try {
          const selected = warehouses.find(
            (warehouse) => warehouse.userId === Number(data?.user?.id),
          );
          setSelectedWarehouse(selected ? selected.name : '');
        } catch (error) {
          console.error('Error fetching warehouseId:', error);
        }
      }
    };

    fetchWarehouseId();
  }, [warehouses, isSuperAdmin, data]);

  const handleDelete = (
    stockId: number,
    warehouseId: number,
    productId: number,
    stock: number,
  ) => {
    setStockToDelete({ stockId, warehouseId, productId, stock });
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (stockToDelete !== null) {
      try {
        const { stockId, warehouseId, productId, stock } = stockToDelete;
        await deleteProductStock(stockId, warehouseId, productId, stock);

        setSortedProducts((prevStocks) =>
          prevStocks.filter((stock) => stock.id !== stockId),
        );
        setIsModalOpen(false);
        setStockToDelete(null);
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const filteredStocks = selectedWarehouse
    ? sortedProducts.filter(
        (stock) => stock.warehouse.name === selectedWarehouse,
      )
    : sortedProducts;

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-row justify-between">
        {/* Dropdown for selecting warehouse */}
        {isSuperAdmin ? (
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="mb-4 border p-2"
          >
            <option value="">All Warehouses</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.name}>
                {warehouse.name}
              </option>
            ))}
          </select>
        ) : (
          <p className="mb-4">Warehouse: {selectedWarehouse}</p>
        )}
        <NewStock />
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Warehouse Name</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((stock) => (
              <tr key={stock.id}>
                <td>{stock.productName}</td>
                <td>{stock.warehouse.name}</td>
                <td>{stock.stock}</td>
                <td>
                  <button
                    onClick={() =>
                      handleDelete(
                        stock.id,
                        stock.warehouse.id,
                        stock.productId,
                        stock.stock,
                      )
                    }
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for delete confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this product stock?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 mr-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
