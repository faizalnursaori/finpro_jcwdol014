'use client';
import Link from 'next/link';
import { ShoppingCart, Search, ClipboardList, MonitorCog } from 'lucide-react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { data, status } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { cartItemCount, clearCart } = useCart();

  useEffect(() => {}, [cartItemCount]);

  // Efek untuk mendeteksi logout
  useEffect(() => {
    if (status === 'unauthenticated') {
      clearCart(); // Kosongkan cart ketika user logout
    }
  }, [status, clearCart]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const categories = [
    {
      category: 'Rice',
      path: '/Rice.jpg',
      slug: 'beras',
    },
    {
      category: 'Fruit & Vegetables',
      path: '/fruitsandvegetables.jpg',
      slug: 'fruit',
    },
    {
      category: 'Instan Foods',
      path: '/readytoeat.jpg',
      slug: 'instant',
    },
    {
      category: 'Beverages',
      path: '/Beverages.jpg',
      slug: 'beverages',
    },
    {
      category: 'Snacks & Biscuits',
      path: '/Snacksandsweets.jpg',
      slug: 'snacks',
    },
    {
      category: 'Frozen',
      path: '/Frozen.jpg',
      slug: 'frozen',
    },
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
          <form
            className="input input-bordered flex items-center gap-2"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              className="w-[50vh] bg-base-200"
              placeholder="Find a product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-ghost">
              <Search />
            </button>
          </form>
          <Link
            href="/cart"
            className={
              data?.user ? 'btn btn-ghost relative' : 'btn btn-disabled'
            }
          >
            <ShoppingCart />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
        <div className="navbar-end gap-4">
          {data?.user ? (
            <details className="dropdown dropdown-bottom">
              <summary className="btn btn-ghost hover:btn-link m-0 p-0">
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img
                      src={
                        data.user.image ? `${data.user.image}` : '/profile.png'
                      }
                    />
                  </div>
                </div>
                {data.user.name ? data.user.name : data.user.username}
              </summary>
              <ul className="menu dropdown-content  bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                <li>
                  <Link href="/profile">Profile</Link>
                </li>
                <li>
                  <Link href="/order/list">Orders</Link>
                </li>
                {data.user.role == 'ADMIN' ||
                data.user.role == 'SUPER_ADMIN' ? (
                  <li>
                    <Link href="/dashboard">Dashboard</Link>
                  </li>
                ) : (
                  ''
                )}
                <li>
                  <button onClick={() => signOut({ callbackUrl: '/login' })}>
                    Log Out
                  </button>
                </li>
              </ul>
            </details>
          ) : (
            <div className="flex gap-2">
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
          {categories.map((category, index) => (
            <Link
              className="btn btn-ghost hover:btn-link"
              href={`/category/${category.slug}`}
              key={index}
            >
              {category.category}
            </Link>
          ))}
        </div>
      </div>
      <div className="divider"></div>
    </header>
  );
}
