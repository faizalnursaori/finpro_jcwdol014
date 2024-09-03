'use client'
import Image from "next/image";
import { ShoppingCart, Search } from "lucide-react";
import { useState } from "react";
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
                <Image className="w-20" src="/logo-revisi.png" alt="Hemart" width={150} height={150} />
            </div>
            <div className="navbar-end gap-3">
            <Search/>
            <ShoppingCart/>
            </div>
            </nav>
        </header>
    )
}