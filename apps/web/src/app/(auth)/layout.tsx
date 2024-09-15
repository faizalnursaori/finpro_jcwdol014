import type { Metadata } from 'next';
import { CartProvider } from '@/context/CartContext';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Hemart',
  description: 'Grocery store built with NextJS',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </CartProvider>
    </>
  );
}
