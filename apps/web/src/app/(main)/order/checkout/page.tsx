'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useOrder } from '@/context/OrderContext';
import { getClosestWarehouse } from '@/api/warehouse';
import { useRouter } from 'next/navigation';
import OrderDetails from '@/components/OrderDetail';
import WithAuth from '@/components/WithAuth';
import Image from 'next/image';
import { paymentMethods } from '@/utils/paymentList';
import { Toaster, toast } from 'react-hot-toast';
import { applyVoucher } from '@/api/vouchers';

const OrderProcessingPage = () => {
  const { cart } = useCart();
  const { checkout, checkStock } = useOrder();
  const [closestWarehouseId, setClosestWarehouseId] = useState<number | null>(
    null,
  );
  const [isStockAvailable, setIsStockAvailable] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [selectedBankData, setSelectedBankData] = useState<
    (typeof paymentMethods)[0] | null
  >(null);
  const [voucherCode, setVoucherCode] = useState<string>(''); // State for the voucher code
  const [discount, setDiscount] = useState<number>(0); // State for discount amount
  const [finalTotal, setFinalTotal] = useState<number>(0); // State for final total
  const [shippingCost, setShippingCost] = useState<any>(0)

  const router = useRouter();

  const getShippingCost = async (data:any) => {
    setShippingCost(data)
  }

  useEffect(() => {
    const fetchClosestWarehouse = async () => {
      const warehouseId = await getClosestWarehouse();
      setClosestWarehouseId(warehouseId ?? null);
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
          toast.error('Some items in your order are out of stock.');
        }
      }
    };

    checkStockAvailability();
  }, [closestWarehouseId, cart, checkStock]);

  const handleBankSelection = (bank: (typeof paymentMethods)[0]) => {
    setSelectedBank(bank.name);
    setSelectedBankData(bank);

    localStorage.setItem('selectedBank', JSON.stringify(bank));
  };

  const handleVoucherApply = async () => {
    if (!voucherCode) {
      toast.error('Please enter a voucher code.');
      return;
    }

    try {
      const response = await applyVoucher(voucherCode, cart?.id as number);
      setDiscount(response.discount);
      setFinalTotal(response.finalTotal);
      toast.success(response.message);
    } catch (error: any) {
      console.error('Failed to apply voucher', error);
      toast.error(error.message);
    }
  };

  const handleCheckout = async () => {
    if (!isStockAvailable) {
      toast.error('Sorry, some items in your order are out of stock.');
      return;
    }

    if (!cart || !closestWarehouseId) {
      toast.error('Unable to process order. Please try again.');
      return;
    }

    try {
      const total =
        cart.items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0,
        ) + shippingCost;

      const expirePayment = new Date();
      expirePayment.setHours(expirePayment.getHours() + 1);

      const orderData = {
        name: `Order-${Date.now()}`,
        paymentStatus: 'PENDING',
        shippingCost,
        total,
        paymentMethod:
          paymentMethod === 'BANK_TRANSFER' ? selectedBank : 'PAYMENT_GATEWAY',
        warehouseId: closestWarehouseId,
        cartId: cart.id,
        addressId: 1,
        orderItems: cart.items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          total: item.product.price * item.quantity,
        })),
        expirePayment: expirePayment.toISOString(),
      };

      const response = await checkout(orderData);
      setOrderId(response.orderId);

      toast.success('Order placed successfully!');

      if (paymentMethod === 'PAYMENT_GATEWAY') {
        router.push(`/order/payment-gateway/${response.orderId}`);
      } else if (paymentMethod === 'BANK_TRANSFER') {
        router.push(`/order/bank-transfer/${response.orderId}`);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Checkout failed', error);
      toast.error('Failed to process your order. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-center" reverseOrder={false} />
      <h1 className="text-2xl font-bold mb-4">Order Processing</h1>
      {cart && <OrderDetails cart={cart} warehouseId={closestWarehouseId} discount={discount} GetShippingCost={getShippingCost}/>}
      {/* Voucher Code Input */}
      <div className="mb-4">
        <label className="label">
          <span className="label-text font-semibold">Voucher Code:</span>
        </label>
        <div className="flex">
          <input
            type="text"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            placeholder="Enter your voucher code"
            className="input input-bordered flex-1 mr-2"
          />
          <button onClick={handleVoucherApply} className="btn btn-primary">
            Apply
          </button>
        </div>
      </div>
      <div className="mb-4">
        <label className="label">
          <span className="label-text font-semibold">Payment Method:</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`btn ${paymentMethod === 'BANK_TRANSFER' ? 'btn-primary' : 'btn-outline'} flex items-center justify-center`}
            onClick={() => {
              setPaymentMethod('BANK_TRANSFER');
              setSelectedBank('');
            }}
          >
            <span>Bank Transfer</span>
          </div>
          <div
            className={`btn ${paymentMethod === 'PAYMENT_GATEWAY' ? 'btn-primary' : 'btn-outline'} flex items-center justify-center`}
            onClick={() => {
              setPaymentMethod('PAYMENT_GATEWAY');
              setSelectedBank('');
            }}
          >
            <Image
              src="/icons/doku.png"
              alt="Doku"
              width={32}
              height={32}
              className="mr-2"
            />
            <span>Doku Payment Gateway</span>
          </div>
        </div>

        {paymentMethod === 'BANK_TRANSFER' && (
          <div className="mt-4">
            <label className="label">
              <span className="label-text font-semibold">Select Bank:</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              {paymentMethods.map((bank) => (
                <div
                  key={bank.name}
                  className={`btn ${selectedBank === bank.name ? 'btn-primary' : 'btn-outline'} flex items-center justify-start`}
                  onClick={() => handleBankSelection(bank)}
                >
                  <Image
                    src={bank.icon}
                    alt={bank.name}
                    width={32}
                    height={32}
                    className="mr-2"
                  />
                  <span>{bank.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <button
        onClick={handleCheckout}
        disabled={
          !isStockAvailable ||
          !paymentMethod ||
          (paymentMethod === 'BANK_TRANSFER' && !selectedBank)
        }
        className="btn btn-primary w-full mt-4"
      >
        Place Order
      </button>
    </div>
  );
};

export default WithAuth(OrderProcessingPage);
