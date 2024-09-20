'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useOrder } from '@/context/OrderContext';
import { Order, PaymentStatus } from '@/types/order';
import WithAuth from '@/components/WithAuth';
import { formatRupiah } from '@/utils/currencyUtils';
import { formatDate } from '@/utils/dateUtils';
import Cookies from 'js-cookie';

const OrderListPage = () => {
  const { cancelOrder } = useOrder();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchDate, setSearchDate] = useState('');
  const [searchOrderNo, setSearchOrderNo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<{
        success: boolean;
        orders: Order[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalItems: number;
          itemsPerPage: number;
        };
      }>(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/orders?page=${currentPage}&limit=10&sortBy=${sortBy}&sortOrder=${sortOrder}&startDate=${searchDate}&orderNumber=${searchOrderNo}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        },
      );
      if (response.data.success) {
        setOrders(response.data.orders);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, sortBy, sortOrder]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchOrders();
  };

  const handleCancelOrder = async (orderId: number) => {
    try {
      await cancelOrder(orderId, 'USER');
      alert('Order cancelled successfully');
      fetchOrders();
    } catch (error) {
      console.error('Order cancellation failed', error);
      alert('Failed to cancel order.');
    }
  };

  const handleSort = (field: string) => {
    if (field === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getStatusBadge = (status: PaymentStatus) => {
    if (status === 'PENDING') {
      return <span className="badge badge-warning">{status}</span>;
    } else if (
      status === 'PAID' ||
      status === 'SHIPPED' ||
      status === 'DELIVERED'
    ) {
      return <span className="badge badge-success">{status}</span>;
    } else if (status === 'FAILED' || status === 'CANCELED') {
      return <span className="badge badge-error">{status}</span>;
    } else {
      return <span className="badge">{status}</span>;
    }
  };

  if (isLoading) {
    return <div className="loading loading-lg"></div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="input input-bordered"
        />
        <input
          type="text"
          placeholder="Order No"
          value={searchOrderNo}
          onChange={(e) => setSearchOrderNo(e.target.value)}
          className="input input-bordered"
        />
        <button onClick={handleSearch} className="btn btn-primary">
          Search
        </button>
      </div>
      {orders.length === 0 ? (
        <p className="text-lg">No orders found.</p>
      ) : (
        <div>
          <table className="table w-full">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')}>
                  Order No{' '}
                  {sortBy === 'id' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('createdAt')}>
                  Date{' '}
                  {sortBy === 'createdAt' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('paymentStatus')}>
                  Status{' '}
                  {sortBy === 'paymentStatus' &&
                    (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('total')}>
                  Total{' '}
                  {sortBy === 'total' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{getStatusBadge(order.paymentStatus)}</td>
                  <td>{formatRupiah(order.total)}</td>
                  <td>
                    <Link
                      href={`/order/${order.id}`}
                      className="btn btn-primary btn-sm mr-2"
                    >
                      View Details
                    </Link>
                    {order.paymentStatus === 'PENDING' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="btn btn-error btn-sm"
                      >
                        Cancel Order
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`btn btn-sm mx-1 ${currentPage === page ? 'btn-active' : ''}`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WithAuth(OrderListPage);
