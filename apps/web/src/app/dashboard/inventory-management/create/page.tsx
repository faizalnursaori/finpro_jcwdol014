// @ts-nocheck

'use client';

import { useState, useEffect } from 'react';
import { createStock, getProductStock } from '@/api/inventory';
import { getWarehouses } from '@/api/warehouse';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

const CreateInventoryPage = () => {
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(
    null,
  );
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [stock, setStock] = useState<any | null>(null);
  const [quantityChange, setQuantityChange] = useState<number>(0);
  const [productId, setProductId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: sessionData } = useSession();

  useEffect(() => {
    const fetchWarehouses = async () => {
      setLoading(true);
      try {
        const storeData = await getWarehouses();
        setWarehouses(storeData);

        if (sessionData?.user?.role === 'ADMIN') {
          const adminWarehouse = storeData.find(
            (warehouse: any) => warehouse.userId == sessionData?.user?.id,
          );
          if (adminWarehouse) {
            setSelectedWarehouse(adminWarehouse.id);
          }
        }
      } catch (err) {
        setError('Failed to fetch warehouses');
      } finally {
        setLoading(false);
      }
    };
    fetchWarehouses();
  }, [sessionData]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedWarehouse) {
        try {
          setLoading(true);
          const productStock = await getProductStock();
          setProducts(productStock);
        } catch (err) {
          setError('Failed to fetch products');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProducts();
  }, [selectedWarehouse]);

  useEffect(() => {
    const selectedProductStock = products.find(
      (product) => product.id === productId,
    );
    const warehouseStock = selectedProductStock?.productStocks.find(
      (stockItem) => stockItem.warehouseId === selectedWarehouse,
    );
    setStock(warehouseStock || null);
  }, [products, productId, selectedWarehouse]);

  const handleUpdateStock = async () => {
    if (productId && selectedWarehouse) {
      try {
        setLoading(true);
        await createStock(productId, selectedWarehouse, quantityChange);
        toast.success('Stock updated successfully');
        router.push('/dashboard/inventory-management');
      } catch (error) {
        setError('Product already has stock for this warehouse');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto min-w-full my-6">
      <Toaster />
      <h1 className="text-xl mb-4">Add New Stock</h1>

      {sessionData?.user?.role === 'SUPER_ADMIN' && (
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Select Warehouse</span>
          </label>
          <select
            className="select select-bordered w-full max-w-xs"
            value={selectedWarehouse ?? ''}
            onChange={(e) => setSelectedWarehouse(Number(e.target.value))}
          >
            <option disabled value="">
              Select a warehouse
            </option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {sessionData?.user?.role === 'ADMIN' && (
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Warehouse</span>
          </label>
          <p>
            {warehouses.find(
              (warehouse) => warehouse.userId === sessionData?.user?.id,
            )?.name || 'Loading...'}
          </p>
        </div>
      )}

      {selectedWarehouse && (
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Select Product</span>
          </label>
          <select
            className="select select-bordered w-full max-w-xs"
            value={productId ?? ''}
            onChange={(e) => setProductId(Number(e.target.value))}
          >
            <option disabled value="">
              Select a product
            </option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedWarehouse && (
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Current Stock</span>
          </label>
          <p>{stock?.stock ?? 'No stock data'}</p>
        </div>
      )}

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">New Stock Quantity</span>
        </label>
        <input
          type="number"
          className="input input-bordered w-full max-w-xs"
          value={quantityChange}
          onChange={(e) => setQuantityChange(Number(e.target.value))}
        />
      </div>

      <button
        className="btn btn-primary"
        onClick={handleUpdateStock}
        disabled={loading || !productId || !selectedWarehouse}
      >
        {loading ? 'Updating...' : 'Update Stock'}
      </button>
    </div>
  );
};

export default CreateInventoryPage;
