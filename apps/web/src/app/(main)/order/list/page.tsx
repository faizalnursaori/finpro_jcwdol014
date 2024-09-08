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

  if (isLoading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      <div className="mb-4">
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <input
          type="text"
          placeholder="Order No"
          value={searchOrderNo}
          onChange={(e) => setSearchOrderNo(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>
      {filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredOrders.map((order) => (
            <li key={order.id} className="border p-4 rounded">
              <div>Order No: {order.id}</div>
              <div>Name: {order.name}</div>
              <div>Status: {order.paymentStatus}</div>
              <div>Total: ${(order.total / 100).toFixed(2)}</div>
              <div>Date: {new Date(order.createdAt).toLocaleDateString()}</div>
              {order.paymentStatus === 'PENDING' && (
                <button
                  onClick={() => handleCancelOrder(order.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                >
                  Cancel Order
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WithAuth(OrderListPage);
