'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useOrder } from '@/context/OrderContext';
import { getClosestWarehouse } from '@/api/warehouse';
import { useRouter } from 'next/navigation';
import OrderDetails from '@/components/OrderDetail';
import WithAuth from '@/components/WithAuth';

const OrderProcessingPage = () => {
  const { cart } = useCart();
  const { checkout, checkStock } = useOrder();
  const [closestWarehouseId, setClosestWarehouseId] = useState<number | null>(
    null,
  );
  const [isStockAvailable, setIsStockAvailable] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchClosestWarehouse = async () => {
      const warehouseId = await getClosestWarehouse();
      setClosestWarehouseId(warehouseId);
    };

    fetchClosestWarehouse();
  }, []);

  useEffect(() => {
    const checkStockAvailability = async () => {
      if (closestWarehouseId && cart) {
        const stockData = {
          warehouseId: closestWarehouseId,
          products: cart.items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        };
        try {
          await checkStock(stockData);
          setIsStockAvailable(true);
        } catch (error) {
          console.error('Stock check failed', error);
          setIsStockAvailable(false);
        }
      }
    };

    checkStockAvailability();
  }, [closestWarehouseId, cart, checkStock]);

  const handleCheckout = async () => {
    if (!isStockAvailable) {
      alert('Sorry, some items in your order are out of stock.');
      return;
    }

    if (!cart || !closestWarehouseId) {
      alert('Unable to process order. Please try again.');
      return;
    }

    try {
      const shippingCost = 15000; // This can be dynamic
      const total =
        cart.items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0,
        ) + shippingCost;

      // Set expiration for payment to 1 hour from now
      const expirePayment = new Date();
      expirePayment.setHours(expirePayment.getHours() + 1);

      const orderData = {
        name: `Order-${Date.now()}`, // Generate a unique name for the order
        paymentStatus: 'PENDING',
        shippingCost,
        total,
        paymentMethod,
        warehouseId: closestWarehouseId,
        cartId: cart.id,
        addressId: 1, // You might want to make this dynamic based on user's selected address
        orderItems: cart.items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          total: item.product.price * item.quantity,
        })),
        expirePayment: expirePayment.toISOString(),
      };

      console.log('Checkout data:', orderData);
      console.log('Items:', orderData.orderItems);

      const response = await checkout(orderData);
      setOrderId(response.orderId);

      if (paymentMethod === 'PAYMENT_GATEWAY') {
        router.push(`/order/payment-gateway/${response.orderId}`);
      } else if (paymentMethod === 'BANK_TRANSFER') {
        router.push(`/order/bank-transfer/${response.orderId}`);
      } else {
        // Redirect to home page after successful checkout
        router.push('/');
      }
    } catch (error) {
      console.error('Checkout failed', error);
      alert('Failed to process your order. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order Processing</h1>
      {cart && <OrderDetails cart={cart} />}
      <div className="mb-4">
        <label className="block mb-2">Payment Method:</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select payment method</option>
          <option value="BANK_TRANSFER">Bank Transfer</option>
          <option value="PAYMENT_GATEWAY">Payment Gateway</option>
        </select>
      </div>
      <button
        onClick={handleCheckout}
        disabled={!isStockAvailable || !paymentMethod}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        Place Order
      </button>
    </div>
  );
};

export default WithAuth(OrderProcessingPage);
