'use client'
import Link from "next/navigation";
import { ShoppingCart, Search, Key, Menu } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import HamburgerMenu from "./Sidebar";
import Sidebar from "./Sidebar";

export default function HeaderMobile(){
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)


      const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
      }
    return(
        <header className="flex lg:hidden items-center justify-between">
            <nav className="navbar p-3">
            <div className="navbar-start">
                <Sidebar/>
            </div>
            <div className="navbar-center">
                <img className="w-20" src="/logo-revisi.png" alt="Hemart" />
            </div>
            <div className="navbar-end gap-3">
            <Search/>
            <ShoppingCart/>
            </div>
            </nav>
        </header>
    )
}