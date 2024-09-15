import Link from 'next/link';
import React from 'react';

export const NewUser = () => {
  return (
    <Link href={'admin-management/create'}>
      <button className="btn btn-outline btn-primary">+New Admin</button>
    </Link>
  );
};
