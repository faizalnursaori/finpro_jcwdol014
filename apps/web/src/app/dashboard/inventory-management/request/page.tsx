'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getProductStockByWarehouseId } from '@/api/inventory';
import { getWarehouseId } from '@/api/warehouse';
import { createStockRequest } from '@/api/stockTransfer';

export default function CreateStockRequest() {
  const [products, setProducts] = useState<any[]>([]);
  const [productId, setProductId] = useState('');
  const [stockRequest, setStockRequest] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warehouseName, setWarehouseName] = useState<string | null>(null);
  const [warehouseId, setWarehouseId] = useState<number | null>(null);
  const { data } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchWarehouseAndProducts = async () => {
      if (data?.user?.id) {
        try {
          const warehouse = await getWarehouseId(data.user.id);
          setWarehouseId(warehouse.id);
          setWarehouseName(warehouse.name);

          const res = await getProductStockByWarehouseId(warehouse.id);
          setProducts(res.productStock);
        } catch (error) {
          setError('Your account is not managing a store');
          console.error(error);
        }
      }
    };
    fetchWarehouseAndProducts();
  }, [data?.user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await createStockRequest(
        Number(productId),
        Number(stockRequest),
        Number(warehouseId),
        note,
      );
      router.push('/dashboard/inventory-management/request-management');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create stock request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto min-w-96 mt-8 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-6">Create Stock Request</h1>

      {warehouseName && <p className="mb-4">Warehouse: {warehouseName}</p>}
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Product</label>
          <select
            className="input input-bordered w-full"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a product
            </option>
            {products.map((item) => (
              <option key={item.product.id} value={item.productId}>
                {item.product.name} (Stock: {item.stock})
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label htmlFor="stockRequest" className="label">
            <span className="label-text">Stock Request Quantity</span>
          </label>
          <input
            type="number"
            id="stockRequest"
            value={stockRequest}
            onChange={(e) => setStockRequest(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control">
          <label htmlFor="note" className="label">
            <span className="label-text">Note</span>
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="textarea textarea-bordered w-full"
          ></textarea>
        </div>

        <div className="form-control mt-4">
          <button
            type="submit"
            className={`btn ${loading ? 'loading' : 'btn-primary'}`}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Stock Request'}
          </button>
        </div>
      </form>
    </div>
  );
}
