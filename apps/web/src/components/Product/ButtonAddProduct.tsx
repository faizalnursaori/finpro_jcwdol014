import Link from 'next/link';
import React from 'react';

export const NewProduct = () => {
  return (
    <Link href={'/dashboard/product-management/create'}>
      <button className="btn btn-outline btn-primary">+New Product</button>
    </Link>
  );
};
