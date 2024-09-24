import Link from 'next/link';
import React from 'react';

export const ToSummary = () => {
  return (
    <Link href={'/dashboard/inventory-management/inventory-report'}>
      <button className="btn btn-secondary mt-5">Summary Log</button>
    </Link>
  );
};
