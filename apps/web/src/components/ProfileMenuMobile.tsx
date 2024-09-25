'use client';
import Link from 'next/link';
import { User, MapPinHouse, ShoppingBag, Key, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function ProfileMenuMobile() {
  return (
    <div className="carousel w-[100vw] sm:hidden justify-between carousel-center bg-base-100 shadow-xl overflow-x-auto rounded-box max-w-md space-x-4 p-4">
      <div className="carousel-item flex flex-col items-center border-e-0">
        <Link href={'/profile'} className='flex flex-col items-center justify-center'>
          <User />
          Profile
        </Link>
      </div>
      <div className="carousel-item flex flex-col items-center">
        <Link href={'/profile/addresses'} className='flex flex-col items-center justify-center'>
          <MapPinHouse />
          Addresses
        </Link>
      </div>
      <div className="carousel-item flex flex-col items-center">
        <Link href="/profile/change-password" className='flex flex-col items-center justify-center'>
          <Key />
          Change Password
        </Link>
      </div>
      <div className="carousel-item flex flex-col items-center">
        <button className='flex flex-col items-center justify-center' onClick={() => signOut({ callbackUrl: '/login' })}>
          <LogOut />
          Log Out
        </button>
      </div>
    </div>
  );
}