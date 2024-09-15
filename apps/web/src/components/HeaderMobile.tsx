'use client';
import Image from 'next/image';
import { ShoppingCart, Search } from 'lucide-react';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';

export default function HeaderMobile() {
  const { cartItemCount } = useCart();
  const {data} = useSession()
  
  return (
    <header className="flex lg:hidden items-center justify-between">
      <nav className="navbar p-3">
        <div className="navbar-start">
          <Sidebar />
        </div>
        <Link href='/' className="navbar-center">
          <Image
            className="w-20"
            src="/logo-revisi.png"
            alt="Hemart"
            width={150}
            height={150}
          />
        </Link>
        <div className="navbar-end gap-3">
          <Search />
          <Link
            href="/cart"
            className={data?.user ? 'btn btn-ghost' : 'btn btn-disabled'}
          >
            <ShoppingCart />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 left-7 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
