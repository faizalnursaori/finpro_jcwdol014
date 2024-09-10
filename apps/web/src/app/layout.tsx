'use client'
import type { Metadata } from 'next';
import { CartProvider } from '../context/CartContext';
import './globals.css';
import Header from '@/components/Header';
import HeaderMobile from '@/components/HeaderMobile';
import Footer from '@/components/Footer';
import FooterMobile from '@/components/FooterMobile';
import {SessionProvider} from 'next-auth/react'



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <HeaderMobile />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <FooterMobile />
            <Footer />
          </div>
        </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
