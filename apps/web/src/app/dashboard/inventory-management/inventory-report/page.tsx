// @ts-nocheck

'use client';

import { useState, useEffect } from 'react';
import { getWarehouses } from '@/api/warehouse';
import { getStockSummaryByMonth } from '@/api/reports';
import { ToDetails } from '@/components/Inventory/ButtonToDetails';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function StockSummaryPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(
    null,
  );
  const [summary, setSummary] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(9); // Default to September
  const [selectedYear, setSelectedYear] = useState(2024); // Default to 2024
  const { data: sessionData } = useSession();

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  useEffect(() => {
    const fetchWarehouses = async () => {
      const result = await getWarehouses();
      setWarehouses(result);

      if (sessionData?.user?.role === 'ADMIN') {
        const adminWarehouse = result.find(
          (warehouse: any) => warehouse.userId === sessionData?.user?.id,
        );
        if (adminWarehouse) {
          setSelectedWarehouse(adminWarehouse.id);
        }
      } else if (sessionData?.user?.role === 'SUPER_ADMIN') {
        if (result.length > 0) {
          setSelectedWarehouse(result[0].id);
        }
      }
    };

    fetchWarehouses();
  }, [sessionData]);

  useEffect(() => {
    if (selectedWarehouse) {
      const fetchSummary = async () => {
        const result = await getStockSummaryByMonth(
          selectedWarehouse,
          selectedMonth,
          selectedYear,
        );
        setSummary(result);
      };

      fetchSummary();
    }
  }, [selectedWarehouse, selectedMonth, selectedYear]);

  return (
    <div className="flex flex-col">
      {sessionData?.user?.role == 'SUPER_ADMIN' ||
      sessionData?.user?.role === 'ADMIN' ? (
        <>
          <div className="p-8 min-w-full md:w-1/2 md:min-w-fit">
            <h1 className="text-xl font-bold mb-6">Monthly Stock Summary</h1>

            {/* Warehouse selection for SUPER_ADMIN */}
            {sessionData?.user?.role === 'SUPER_ADMIN' && (
              <div className="mb-6">
                <label className="block mb-2 font-semibold" htmlFor="warehouse">
                  Select Warehouse:
                </label>
                <select
                  id="warehouse"
                  className="select select-bordered w-full max-w-xs"
                  value={selectedWarehouse ?? ''}
                  onChange={(e) => setSelectedWarehouse(Number(e.target.value))}
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
                  {warehouses.find(
                    (warehouse) => warehouse.id === selectedWarehouse,
                  )?.name || 'Loading...'}
                </p>
              </div>
            )}

            {/* Month selection */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold" htmlFor="month">
                Select Month:
              </label>
              <select
                id="month"
                className="select select-bordered w-full max-w-xs"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock Summary Table */}
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Total In</th>
                    <th>Total Out</th>
                    <th>Ending Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.length > 0 ? (
                    summary.map((item) => (
                      <tr key={item.productId}>
                        <td>{item.productName}</td>
                        <td>{item.totalIn}</td>
                        <td>{item.totalOut}</td>
                        <td>{item.finalStock}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center">
                        No data available for this selection.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <ToDetails />
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center items-center flex-col p-3">
            <h2 className="text-3xl text-center my-2">
              You Don't have an access to this page.
            </h2>
            <div className="mt-4 flex w-80 items-center justify-center gap-8">
              <Link
                className="relative flex items-center justify-center text-xl no-underline outline-none transition-opacity hover:opacity-80 active:opacity-60"
                href="/"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="m12 19-7-7 7-7"></path>
                  <path d="M19 12H5"></path>
                </svg>
                <span className="flex items-center">Back to Homepage</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
