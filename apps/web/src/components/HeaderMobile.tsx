'use client';

import Image from 'next/image';
import { ShoppingCart, Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function HeaderMobile() {
  const { cartItemCount } = useCart();
  const { data } = useSession();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearchToggle = () => {
    setIsSearchActive(!isSearchActive);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setIsSearchActive(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchActive(false);
      }
    };

    if (isSearchActive) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchActive]);

  return (
    <header className="flex lg:hidden items-center justify-between">
      <nav className="navbar p-3">
        <div className="navbar-start">
          <Sidebar />
        </div>
        <Link href="/" className="navbar-center">
          <Image
            className="w-20"
            src="/logo-revisi.png"
            alt="Hemart"
            width={150}
            height={150}
          />
        </Link>
        <div className="navbar-end gap-3" ref={searchRef}>
          {!isSearchActive ? (
            <button onClick={handleSearchToggle} className="btn btn-ghost">
              <Search />
            </button>
          ) : (
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="input input-bordered w-32"
                placeholder="Search..."
              />
              <button type="submit" className="btn btn-ghost">
                <Search />
              </button>
            </form>
          )}
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
