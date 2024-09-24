import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useSession, signOut } from 'next-auth/react';

export default function Sidebar() {
  const { cartItemCount } = useCart();
  const { data } = useSession();

  const categories = [
    'Rice and Flour',
    'Fruits and Vegetables',
    'Instant Food',
    'Beverages',
    'Snacks and Biscuits',
    'Frozen',
  ];
  return (
    <div className="drawer z-30 ">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label
          htmlFor="my-drawer"
          className="btn ml-1 btn-ghost btn-circle drawer-button"
        >
          <Menu />
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <ul className="menu bg-base-100  text-base-content min-h-full w-[80vw] p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-center text-2xl font-medium">Menu</h2>
            <label
              htmlFor="my-drawer"
              className="btn btn-ghost btn-circle drawer-button"
            >
              <X />
            </label>
          </div>
          <div className="divider"></div>
          {data?.user ? (
            <div>
              <h2 className="text-xl font-medium mb-2">Profile</h2>
              <li>
                <Link href="/profile">My Profile</Link>
              </li>
              {data?.user?.role == 'SUPER_ADMIN' ||
              data?.user?.role == 'ADMIN' ? (
                <li>
                  <Link href="/dashboard">Dashboard</Link>
                </li>
              ) : (
                ''
              )}
              <li>
                <Link href="/cart">My Cart</Link>
              </li>
              <div className="divider"></div>
            </div>
          ) : (
            <div></div>
          )}
          <h2 className="text-xl font-medium mb-2">Categories</h2>
          {categories.map((category, index) => {
            return (
              <li key={index}>
                <Link href={`/search?query=${category}`}>{category}</Link>
              </li>
            );
          })}
          <div className="divider"></div>
          <li>
            <Link href="/about">About us</Link>
          </li>
          <li>
            <Link href="/faq">Frequenly Asked Question</Link>
          </li>
          <li>
            <Link href="/shiiping">Shipping Information</Link>
          </li>
          <div className="divider"></div>
          {data?.user ? (
            <div className="w-full">
              <button
                className="btn w-full btn-ghost "
                onClick={() => signOut({ callbackUrl: '/login' })}
              >
                Log Out
              </button>
            </div>
          ) : (
            <div>
              <button className="btn mb-2 btn-ghost">
                <Link href="/login">Log In</Link>
              </button>
              <button className="btn btn-outline btn-success">
                <Link href="/register">Sign Up</Link>
              </button>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
