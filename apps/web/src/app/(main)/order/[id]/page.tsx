'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Order, PaymentStatus } from '@/types/order';
import { useOrder } from '@/context/OrderContext';
import { formatRupiah } from '@/utils/currencyUtils';
import Cookies from 'js-cookie';

const OrderDetail = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const router = useRouter();
  const { cancelOrder, confirmOrderReceived } = useOrder();

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get('token')}`,
            },
          },
        );
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        const data = await response.json();
        setOrder(data.order);
      } catch (err) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  const handleUploadPaymentProof = () => {
    router.push(`/order/payment-upload?orderId=${id}`);
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    try {
      await cancelOrder(order.id, 'USER');
      alert('Order cancelled successfully');
      setOrder({ ...order, paymentStatus: 'CANCELED' as PaymentStatus });
    } catch (error) {
      console.error('Order cancellation failed', error);
      alert('Failed to cancel order.');
    }
  };

  const handleConfirmReceived = async () => {
    if (!order) return;
    try {
      await confirmOrderReceived(order.id);
      alert('Order received confirmed successfully');
      setOrder({ ...order, paymentStatus: 'DELIVERED' as PaymentStatus });
    } catch (error) {
      console.error('Order received confirmation failed', error);
      alert('Failed to confirm order received. Please try again.');
    }
  };

  if (loading) return <div className="loading loading-lg"></div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!order) return <div className="alert alert-info">Order not found</div>;

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

  const isPending = order.paymentStatus === 'PENDING';
  const isDelivered = order.paymentStatus === 'DELIVERED';
  const isShipped = order.paymentStatus === 'SHIPPED';

  return (
    <div className="container mx-auto p-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl">Order #{order.id}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Order Details</h3>
              <p>
                <strong>Invoice Number:</strong> {order.name}
              </p>
              <p>
                <strong>Created At:</strong>{' '}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Shipping Cost:</strong>{' '}
                {formatRupiah(order.shippingCost)}
              </p>
              <p>
                <strong>Total:</strong> {formatRupiah(order.total)}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Payment Information
              </h3>
              <p>
                <strong>Status:</strong> {getStatusBadge(order.paymentStatus)}
              </p>
              <p>
                <strong>Method:</strong> {order.paymentMethod}
              </p>
              {order.paymentProof && (
                <p>
                  <strong>Payment Proof:</strong>
                  <button className="btn btn-link btn-xs">View Proof</button>
                </p>
              )}
              <p>
                <strong>Expires:</strong>{' '}
                {new Date(order.expirePayment).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Order Items</h3>
            <ul className="list-disc pl-5">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.product.name} - Quantity: {item.quantity} - Price:{' '}
                  {formatRupiah(item.price * item.quantity)}
                </li>
              ))}
            </ul>
          </div>

          {order.voucher && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Applied Voucher</h3>
              <p>
                <strong>Code:</strong> {order.voucher.code}
              </p>
              <p>
                <strong>Discount:</strong>
                {order.voucher.discountType === 'PERCENTAGE'
                  ? `${order.voucher.discountValue}%`
                  : `$${order.voucher.discountValue.toFixed(2)}`}
              </p>
            </div>
          )}

          <div className="card-actions justify-end mt-6">
            {isPending && (
              <button
                className="btn btn-primary"
                onClick={handleUploadPaymentProof}
              >
                Upload Payment Proof
              </button>
            )}
            {isShipped && (
              <button
                className="btn btn-success"
                onClick={handleConfirmReceived}
              >
                Confirm Received
              </button>
            )}
            {['PENDING'].includes(order.paymentStatus) && (
              <button className="btn btn-error" onClick={handleCancelOrder}>
                Cancel Order
              </button>
            )}
          </div>

          {isPending && (
            <div className="alert alert-info mt-4">
              Please upload your payment proof to confirm your order.
            </div>
          )}
          {isShipped && (
            <div className="alert alert-success mt-4">
              Your order has been shipped. It will be delivered soon!
            </div>
          )}
          {isDelivered && (
            <div className="alert alert-success mt-4">
              Your order has been delivered. Please confirm if you have received
              it.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
