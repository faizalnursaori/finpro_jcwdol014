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
  return <OrderProvider>{children}</OrderProvider>;
}
