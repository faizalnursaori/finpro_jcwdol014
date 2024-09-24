import Link from 'next/link';
import React from 'react';

export const RequestStock = () => {
  return (
    <Link href={'request'}>
      <button className="btn btn-outline btn-primary">Request Stock</button>
    </Link>
  );
};
