import Link from 'next/link';
import React from 'react';

export const AddStoreButton = () => {
  return (
    <Link href={'/dashboard/store-management/create'}>
      <button className="btn btn-outline btn-success">New Warehouse</button>
    </Link>
  );
};
