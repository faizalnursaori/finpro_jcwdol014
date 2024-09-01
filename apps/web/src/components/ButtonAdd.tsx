import Link from 'next/link';
import React from 'react';

export const NewUser = () => {
  return (
    <Link href={'/dashboard/admin/admin-management/create'}>
      <button className="btn btn-outline btn-secondary">+New Admin</button>
    </Link>
  );
};
