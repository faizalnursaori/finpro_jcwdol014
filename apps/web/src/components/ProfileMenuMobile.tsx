'use client';
import Link from 'next/link';
import { User, MapPinHouse, ShoppingBag, Key, LogOut } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';


export default function ProfileMenuMobile() {
  const {data} = useSession()

  return (
    <>
    <h2 className='font-semibold text-xl md:hidden'>{data?.user?.name}</h2>
    <p className='md:hidden'>{data?.user?.email}</p>
    <div className="carousel w-[100vw] md:hidden justify-between carousel-center bg-base-100 shadow-xl overflow-x-auto space-x-4">
      <div className="carousel-item flex flex-col items-center p-5  border-r-4 max-w-28 w-full">
        <Link href={'/profile'} className='flex flex-col items-center justify-center'>
          <User />
          Profile
        </Link>
      </div>
      <div className="carousel-item flex flex-col items-center p-5  border-r-4 max-w-28 w-full">
        <Link href={'/profile/addresses'} className='flex flex-col items-center justify-center'>
          <MapPinHouse />
          Addresses
        </Link>
      </div>
      <div className="carousel-item flex flex-col items-center p-5  border-r-4 max-w-28 w-full">
        <Link href={'/order/list'} className='flex flex-col items-center justify-center'>
          <ShoppingBag />
          Orders
        </Link>
      </div>
      <div className="carousel-item flex flex-col items-center p-5  border-r-4 max-w-28 w-full">
        <Link href="/profile/change-password" className='flex flex-col items-center justify-center'>
          <Key />
          Password
        </Link>
      </div>
      <div className="carousel-item flex flex-col items-center p-5 max-w-28 w-full">
        <button className='flex flex-col items-center justify-center' onClick={() => signOut({ callbackUrl: '/login' })}>
          <LogOut />
          Log Out
        </button>
      </div>
    </div>
    </>
  );
}