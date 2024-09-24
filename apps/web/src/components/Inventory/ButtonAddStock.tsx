import Link from 'next/link';
import React from 'react';

export const NewStock = () => {
  return (
    <Link href={'inventory-management/create'}>
      <button className="btn btn-outline btn-primary">+New Stock</button>
    </Link>
  );
};
