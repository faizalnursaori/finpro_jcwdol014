import Link from 'next/link';
import React from 'react';

export const NewVoucher = () => {
  return (
    <Link href={'voucher-management/create'}>
      <button className="btn btn-outline btn-primary">+New Voucher</button>
    </Link>
  );
};
