'use client'
import Link from "next/link";
import { User, MapPinHouse, ShoppingBag, Key, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function ProfileMenu() {
  
  return (
    <div className="card card-compact bg-base-100 w-fit h-fit shadow-xl ml-7">
      <div className="card-body">
        <p className="card-title ml-4">Menu</p>
        <div className="divider m-0"></div>
        <ul className="menu w-56 p-0 gap-2">
          <li>
            <Link href="/profile">
              <User />
              Profile
            </Link>
          </li>
          <li>
            <Link href="/profile">
              <MapPinHouse />
              Addresses
            </Link>
          </li>
          <li>
            <Link href="/profile">
              <ShoppingBag />
              Orders
            </Link>
          </li>
          <li>
            <Link href="/profile/change-password">
              <Key />
              Change Password
            </Link>
          </li>
          <li>
            <button className="" onClick={() => signOut({callbackUrl: '/login'})}>
              <LogOut />
              Log Out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
