'use client';

import { useEffect, useState } from 'react';
import { fetchStockDetails } from '@/api/reports';
import { getWarehouses } from '@/api/warehouse';
import { ToSummary } from '@/components/Inventory/ButtonToSummary';
import { useSession } from 'next-auth/react';

interface Warehouse {
  id: number;
  name: string;
}

export interface Product {
  name: string;
}

interface StockLog {
  id: number;
  createdAt: string;
  warehouse: { name: string };
  quantity: number;
  transactionType: string;
  product: Product;
  description: string;
}

interface StockDetailProps {
  productId: number;
}

export default function StockDetail() {
  const [details, setDetails] = useState<StockLog[]>([]);
  const [year, setYear] = useState<string>('2024');
  const [month, setMonth] = useState<string>('09');
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: sessionData } = useSession();

  // Fetch warehouses and set the first one as default
  useEffect(() => {
    const fetchWarehouses = async () => {
      const result = await getWarehouses();
      setWarehouses(result);

      // If the user is ADMIN, automatically select their warehouse
      if (sessionData?.user?.role === 'ADMIN') {
        const adminWarehouse = result.find(
          (warehouse: any) => warehouse.userId === sessionData?.user?.id,
        );
        if (adminWarehouse) {
          setSelectedWarehouse(adminWarehouse.id);
        }
      } else if (sessionData?.user?.role === 'SUPER_ADMIN') {
        // For SUPER_ADMIN, allow them to choose a warehouse manually
        if (result.length > 0) {
          setSelectedWarehouse(result[0].id);
        }
      }
    };

    fetchWarehouses();
  }, [sessionData]);

  useEffect(() => {
    if (selectedWarehouse && month && year) {
      const loadDetails = async () => {
        setLoading(true);
        setError(null);

        try {
          const data = await fetchStockDetails(selectedWarehouse, year, month);
          setDetails(data);
        } catch (err) {
          setError('Failed to load stock details');
        } finally {
          setLoading(false);
        }
      };

      loadDetails();
    }
  }, [year, month, selectedWarehouse]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Stock Detail Report</h1>

      {/* Select Year */}
      <label className="block mb-2 text-sm font-medium">Select Year:</label>
      <select
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="select select-bordered w-full max-w-xs mb-4"
      >
        <option value="2024">2024</option>
        <option value="2023">2023</option>
        <option value="2022">2022</option>
      </select>

      {/* Select Month */}
      <label className="block mb-2 text-sm font-medium">Select Month:</label>
      <select
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="select select-bordered w-full max-w-xs mb-4"
      >
        <option value="01">January</option>
        <option value="02">February</option>
        <option value="03">March</option>
        <option value="04">April</option>
        <option value="05">May</option>
        <option value="06">June</option>
        <option value="07">July</option>
        <option value="08">August</option>
        <option value="09">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>

      {/* Warehouse selection for SUPER_ADMIN */}
      {sessionData?.user?.role === 'SUPER_ADMIN' && (
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">
            Select Warehouse:
          </label>
          <select
            value={selectedWarehouse || ''}
            onChange={(e) => setSelectedWarehouse(Number(e.target.value))}
            className="select select-bordered w-full max-w-xs mb-4"
          >
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Display the selected warehouse for ADMIN */}
      {sessionData?.user?.role === 'ADMIN' && (
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Warehouse:</label>
          <p>
            {warehouses.find((warehouse) => warehouse.id === selectedWarehouse)
              ?.name || 'Loading...'}
          </p>
        </div>
      )}

      {/* Loading and Error States */}
      {loading && <p>Loading stock details...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Stock Detail Table */}
      {!loading && !error && details.length > 0 && (
        <table className="table w-full">
          <thead>
            <tr>
              <th>Date</th>
              <th>Warehouse</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Transaction Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {details.map((log) => (
              <tr key={log.id}>
                <td>{new Date(log.createdAt).toLocaleDateString()}</td>
                <td>{log.warehouse.name}</td>
                <td>{log.product.name}</td>
                <td>{log.quantity}</td>
                <td>{log.transactionType}</td>
                <td>{log.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* No Data State */}
      {!loading && !error && details.length === 0 && (
        <p>No stock details found for the selected filters.</p>
      )}
      <ToSummary />
    </div>
  );
}
