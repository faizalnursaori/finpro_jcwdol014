'use client';
import { OrderTable } from '@/components/Admin/OrderTable';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function OrderManagement() {
  const { data } = useSession();

  return (
    <>
      <div className="flex flex-col">
        {data?.user?.role === 'SUPER_ADMIN' || data?.user?.role === 'ADMIN' ? (
          <>
            <div className="flex flex-row justify-between">
              <h2 className="text-xl my-4">Order Management</h2>
            </div>
            <div className="bg-white">
              <OrderTable />
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center items-center flex-col p-3">
              <h2 className="text-3xl text-center my-2">
                You Don't have access to this page.
              </h2>
              <div className="mt-4 flex w-80 items-center justify-center gap-8">
                <Link
                  className="relative flex items-center justify-center text-xl no-underline outline-none transition-opacity hover:opacity-80 active:opacity-60"
                  href="/"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="m12 19-7-7 7-7"></path>
                    <path d="M19 12H5"></path>
                  </svg>
                  <span className="flex items-center">Back to Homepage</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
