'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Key } from 'lucide-react';
import Image from 'next/image';
// import { useCart } from '@/lib/CartContext';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { cartItemCount } = useCart();

  const categories = [
    'Rice & Flour',
    'Fruits & Vegetables',
    'Instan Food',
    'Beverages',
    'Snacks & Biscuits',
    'Frozen',
  ];

  return (
    <header className="items-center justify-center hidden lg:flex p-4 flex-col">
      <nav className="navbar max-w-[85%]">
        <div className="navbar-start gap-3">
          <Link href="/" className="btn btn-ghost text-xl">
            <Image
              alt="hemart"
              src="/logo-revisi.png"
              width={100}
              height={50}
            />
          </Link>
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="text"
              className="w-[50vh] bg-base-200"
              placeholder="Find a product..."
            />
          </label>
          <Link href="/cart" className="btn btn-ghost relative">
            <ShoppingCart />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 left-7 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
        <div className="navbar-end gap-2">
          <a className="btn btn-ghost" href="/login">
            Log in
          </a>
          <a className="btn btn-outline btn-success" href="/register">
            Sign in
          </a>
        </div>
      </nav>
      <div>
        <div className="flex justify-between items-center gap-5 pt-2">
          {categories.map((category, index) => {
            return (
              <a
                className="btn btn-ghost hover:btn-link"
                href={`/category/${category}`}
                key={index}
              >
                {category}
              </a>
            );
          })}
        </div>
      </div>
      <div className="divider"></div>
    </header>
  );
}
