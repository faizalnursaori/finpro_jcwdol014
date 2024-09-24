import type { Metadata } from 'next';
import { CartProvider } from '@/context/CartContext';
import '../globals.css';

import { OrderProvider } from '@/context/OrderContext';

export const metadata: Metadata = {
  title: 'Hemart',
  description: 'Grocery store built with NextJS',
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CartProvider>
      <OrderProvider>
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
        </OrderProvider>
      </CartProvider>
    </>
  );
}
