import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const categories = [
    "Rice & Flour",
    "Fruits & Vegetables",
    "Instan Food",
    "Beverages",
    "Snacks & Biscuits",
    "Frozen",
  ];
  return (
    <div className="drawer z-30 ">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Page content here */}
        <label htmlFor="my-drawer" className="btn ml-1 btn-ghost btn-circle drawer-button">
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
          {/* Sidebar content here */}
          <h2 className="text-xl font-medium mb-2">Categories</h2>
          {categories.map((category, index) => {
            return (
              <li key={index}>
                <Link href={`/categories/${category}`}>{category}</Link>
              </li>
            );
          })}
          <div className="divider"></div>
          <li><Link href="/about">About us</Link></li>
          <li><Link href="/faq">Frequenly Asked Question</Link></li>
          <li><Link href="/shiiping">Shipping Information</Link></li>
          <div className="divider"></div>
          <button className="btn mb-2 btn-ghost">Log In</button>
          <button className="btn btn-outline btn-success">Sign In</button>
        </ul>
      </div>
    </div>
  );
}
