'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';
import EmptyCart from '@/components/EmptyCart';
import { ArrowLeft, Trash2 } from 'lucide-react';
import CheckoutSummary from '@/components/CheckOutSummary';
import WithAuth from '@/components/WithAuth';
import { formatRupiah } from '@/utils/currencyUtils';
import { ConfirmationDeleteCart } from '@/components/ConfirmationDeleteCart';
import CartTable from '@/components/CartTable';

const CartPage = () => {
  const { cart, fetchCart, updateItemQuantity, removeItem } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetchCart()
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    try {
      await updateItemQuantity(itemId, newQuantity);
    } catch (err) {
      setError('Failed to update item. Please try again.');
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    setItemToDelete(itemId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete !== null) {
      try {
        await removeItem(itemToDelete);
      } catch (err) {
        setError('Failed to remove item. Please try again.');
      }
      setIsModalOpen(false);
      setItemToDelete(null);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!cart || cart.items.length === 0) return <EmptyCart />;

  const totalPrice = cart.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="container mx-6 p-4">
      <div className="-my-4 mb-10">
        <h1 className="text-2xl font-semibold mb-4">YOUR SHOPPING CART</h1>
        <div className="mb-8 w-fit">
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to shop
          </Link>
        </div>
      </div>
      <CartTable
        items={cart.items}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
      <div className="md:w-1/3 ml-auto">
        <CheckoutSummary />
      </div>
      <ConfirmationDeleteCart
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default WithAuth(CartPage);
