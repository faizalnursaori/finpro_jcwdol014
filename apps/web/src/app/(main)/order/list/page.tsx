'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useOrder } from '@/context/OrderContext';
import { Order, PaymentStatus } from '@/types/order';
import WithAuth from '@/components/WithAuth';

const OrderListPage = () => {
  const { cancelOrder } = useOrder();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchDate, setSearchDate] = useState('');
  const [searchOrderNo, setSearchOrderNo] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get<{ success: boolean; orders: Order[] }>(
          'http://localhost:8000/api/orders',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        );
        if (response.data.success) {
          setOrders(response.data.orders);
          setFilteredOrders(response.data.orders);
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

    fetchOrders();
  }, []);

  const handleSearch = () => {
    const filtered = orders.filter(
      (order) =>
        (!searchDate ||
          new Date(order.createdAt).toISOString().slice(0, 10) ===
            searchDate) &&
        (!searchOrderNo || order.id === parseInt(searchOrderNo)),
    );
    setFilteredOrders(filtered);
  };

  const handleCancelOrder = async (orderId: number) => {
    try {
      await cancelOrder(orderId, 'USER');
      alert('Order cancelled successfully');
      // Refresh the orders list after cancellation
      const updatedOrders = orders.map((order) =>
        order.id === orderId
          ? { ...order, paymentStatus: 'CANCELLED' as PaymentStatus }
          : order,
      );
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
    } catch (error) {
      console.error('Order cancellation failed', error);
      alert('Failed to cancel order.');
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
      {filteredOrders.length === 0 ? (
        <p className="text-lg">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Order No: {order.id}</h2>
                <p>Name: {order.name}</p>
                <p>Status: {getStatusBadge(order.paymentStatus)}</p>
                <p>Total: ${(order.total / 100).toFixed(2)}</p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                {order.paymentStatus === 'PENDING' && (
                  <div className="card-actions justify-end">
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="btn btn-error"
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WithAuth(OrderListPage);
