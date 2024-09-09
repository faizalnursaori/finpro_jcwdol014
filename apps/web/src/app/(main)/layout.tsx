import type { Metadata } from 'next';
import { CartProvider } from '@/context/CartContext';
import '../globals.css';
import Header from '@/components/Header';
import HeaderMobile from '@/components/HeaderMobile';
import Footer from '@/components/Footer';
import FooterMobile from '@/components/FooterMobile';
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
          <div className="flex flex-col min-h-screen">
            <Header />
            <HeaderMobile />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <FooterMobile />
            <Footer />
          </div>
        </OrderProvider>
      </CartProvider>
    </>
  );
}
