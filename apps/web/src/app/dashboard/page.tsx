'use client';

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { useSession } from 'next-auth/react';
import { getWarehouseByUserId, getWarehouses } from '@/api/warehouse';
import {
  fetchSalesData,
  fetchTopProducts,
  fetchTopCategories,
} from '@/api/reports';
import Link from 'next/link';

export default function MonthlySalesReport() {
  const { data } = useSession();
  const [month, setMonth] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [warehouses, setWarehouses] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    totalQuantity: 0,
  });

  useEffect(() => {
    const loadWarehouses = async () => {
      try {
        const fetchedWarehouses = await getWarehouses();
        setWarehouses(fetchedWarehouses);
      } catch (error) {
        console.error('Error fetching warehouses:', error);
      }
    };

    loadWarehouses();
  }, []);

  useEffect(() => {
    const loadWarehouseId = async () => {
      if (data?.user?.role === 'ADMIN') {
        try {
          const warehouse = await getWarehouseByUserId(data.user.id);
          if (warehouse) {
            setWarehouseId(warehouse.id);
          }
        } catch (error) {
          console.error('Error fetching warehouse ID:', error);
        }
      }
    };

    loadWarehouseId();
  }, [data]);

  useEffect(() => {
    if (month && warehouseId) {
      const loadSalesData = async () => {
        try {
          const data = await fetchSalesData(month, warehouseId);
          setSalesData(data);
        } catch (error) {
          console.error('Error loading sales data:', error);
        }
      };

      const loadTopProducts = async () => {
        try {
          const products = await fetchTopProducts(month, warehouseId);
          setTopProducts(products);
        } catch (error) {
          console.error('Error loading top products:', error);
        }
      };

      const loadTopCategories = async () => {
        try {
          const categories = await fetchTopCategories(month, warehouseId);
          setTopCategories(categories);
        } catch (error) {
          console.error('Error loading top categories:', error);
        }
      };

      loadSalesData();
      loadTopProducts();
      loadTopCategories();
    }
  }, [month, warehouseId]);

  const productChartData = {
    labels: topProducts.map((item) => item.name),
    datasets: [
      {
        label: 'Total sales',
        data: topProducts.map((item) => item.totalSales || 0),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const categoryChartData = {
    labels: topCategories.map((item) => item.name),
    datasets: [
      {
        label: 'Total sales',
        data: topCategories.map((item) => item.totalSales || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <>
      {data?.user?.role == 'SUPER_ADMIN' || data?.user?.role == 'ADMIN' ? (
        <>
          <div className="p-5 mx-auto min-w-full md:w-1/2 md:min-w-fit">
            <h1 className="text-2xl font-bold mb-5">Monthly Sales Report</h1>

            <div className="flex flex-row justify-between">
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="input input-bordered mb-4"
              />

              {data?.user?.role === 'SUPER_ADMIN' ? (
                <select
                  value={warehouseId}
                  onChange={(e) => setWarehouseId(e.target.value)}
                  className="select select-bordered mb-4"
                >
                  <option value="">Select a Warehouse</option>
                  {warehouses.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="mb-4">
                  Warehouse:{' '}
                  {warehouseId
                    ? warehouses.find((w) => w.id === warehouseId)?.name
                    : 'Loading...'}
                </p>
              )}
            </div>

            {/* Sales Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="card shadow-lg bg-base-100 p-4">
                <h2 className="text-xl font-bold">Total Sales</h2>
                <p className="text-lg">Rp{salesData.totalSales}</p>
              </div>
              <div className="card shadow-lg bg-base-100 p-4">
                <h2 className="text-xl font-bold">Total Orders</h2>
                <p className="text-lg">{salesData.totalQuantity}</p>
              </div>
            </div>

            {/* Bar Chart for Top Products */}
            <div>
              <h2 className="text-xl font-bold">Top Products</h2>
              <Bar data={productChartData} />
            </div>

            {/* Bar Chart for Top Categories */}
            <div className="mt-6">
              <h2 className="text-xl font-bold">Top Categories</h2>
              <Bar data={categoryChartData} />
            </div>
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
    </>
  );
}
