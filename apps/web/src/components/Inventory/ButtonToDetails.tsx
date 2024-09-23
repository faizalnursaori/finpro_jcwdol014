import Link from 'next/link';
import React from 'react';

export const ToDetails = () => {
  return (
    <Link href={'inventory-report/details'}>
      <button className="btn btn-secondary mt-5">Detail Log</button>
    </Link>
  );
};
