import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const EmptyCart = () => {
  return (
    <div className=" bg-white">
      <div className="flex flex-col items-center justify-center h-[55vh]">
        <h1 className="text-2xl font-bold mb-8 text-gray-800">
          Your cart is currently empty
        </h1>
        <button className="px-6 py-2 bg-white text-gray-800 font-semibold border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
          <Link href="/">RETURN TO SHOP</Link>
        </button>
      </div>
    </div>
  );
};

export default EmptyCart;
