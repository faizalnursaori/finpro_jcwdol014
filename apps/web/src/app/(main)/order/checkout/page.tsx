'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useOrder } from '@/context/OrderContext';
import { getClosestWarehouse } from '@/api/warehouse';
import { useRouter } from 'next/navigation';
import OrderDetails from '@/components/OrderDetail';
import Image from 'next/image';
import { paymentMethods } from '@/utils/paymentList';
import BankInstructionsModal from '@/components/BankInstructionModal';
import { useSession } from 'next-auth/react';
import { getCart } from '@/api/cart';
import { Toaster, toast } from 'react-hot-toast';

const OrderProcessingPage = () => {
  const {data} = useSession()
  const[keranjang, setKeranjang] = useState<any>()
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

  const router = useRouter();

  const getCartData = async () =>{
    const res = await getCart(data?.user?.id as string)
    setKeranjang(res?.cart)
    
  }

  useEffect(() => {
    const fetchClosestWarehouse = async () => {
      const warehouseId = await getClosestWarehouse();
      setClosestWarehouseId(warehouseId);
    };

    fetchClosestWarehouse();
    getCartData()
  }, [data?.user]);

  useEffect(() => {
    const checkStockAvailability = async () => {
      if (closestWarehouseId && cart) {
        const stockData = {
          warehouseId: closestWarehouseId,
          products: keranjang.items.map((item: any) => ({
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
      const shippingCost = 15000;
      const total =
        keranjang.items.reduce(
          (sum:any, item:any) => sum + item.product.price * item.quantity,
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
        cartId: keranjang.id,
        addressId: 1,
        orderItems: keranjang.items.map((item:any) => ({
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
      {keranjang && <OrderDetails cart={keranjang} warehouseId={closestWarehouseId} />}
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

export default OrderProcessingPage;
