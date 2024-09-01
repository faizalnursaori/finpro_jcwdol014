import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import { CartProvider } from '../context/CartContext';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-commerce Store',
  description: 'E-commerce store built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Navbar />
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="bg-neutral text-neutral-content py-4">
              <div className="container mx-auto px-4 text-center">
                &copy; 2024 E-commerce Store
              </div>
            </footer>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
