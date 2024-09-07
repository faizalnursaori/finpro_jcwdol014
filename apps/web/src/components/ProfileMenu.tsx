'use client'
import Link from "next/link";
import { User, MapPinHouse, ShoppingBag, Key, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileMenu() {
  const [user, setUser] = useState(null);
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    router.push("/login");
  }

  useEffect(() => {
    const userData = localStorage.getItem("userInfo");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  return (
    <div className="card card-compact bg-base-100 w-fit shadow-xl ml-7">
      <div className="card-body">
        <p className="card-title">{user?.username}</p>
        <p>{user?.email}</p>
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
            <button className="" onClick={() => handleLogout()}>
              <LogOut />
              Log Out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
