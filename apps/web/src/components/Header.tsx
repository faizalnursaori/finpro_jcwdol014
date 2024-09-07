'use client';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useState,useEffect } from 'react';


export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const token = localStorage.getItem('token');
  const { cartItemCount } = useCart();
  const router = useRouter()


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setIsLoggedIn(false)
    router.push("/login");
  };

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else{
      setIsLoggedIn(false)
    }
  }, [token]);

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
          <Link href="/" className="text-xl">
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
          <Link
            href="/cart"
            className={token ? 'btn btn-ghost' : 'btn btn-disabled'}
          >
            <ShoppingCart />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 left-7 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
        <div className="navbar-end gap-2">
          {isLoggedIn ? (
            <details className="dropdown">
              <summary className="btn btn-ghost hover:btn-link">Hello, user</summary>
              <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                <li>
                  <Link href='/profile'>Profile</Link>
                </li>
                <li>
                  <button onClick={() => handleLogout()}>Log Out</button>
                </li>
              </ul>
            </details>
          ) : (
            <div className='flex gap-2'>
              <Link className="btn btn-ghost" href="/login">
                Log In
              </Link>
              <Link className="btn btn-outline btn-success" href="/register">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
      <div>
        <div className="flex justify-between items-center gap-5 pt-2">
          {categories.map((category, index) => {
            return (
              <Link
                className="btn btn-ghost hover:btn-link"
                href={`/category/${category}`}
                key={index}
              >
                {category}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="divider"></div>
    </header>
  );
}
