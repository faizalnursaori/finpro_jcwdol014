'use client';

import React, { useEffect, useState } from 'react';
import { NewVoucher } from '@/components/Voucher/ButtonAddVoucher';
import { fetchVouchers, deleteVoucherById } from '@/api/vouchers';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Voucher {
  id: number;
  code: string;
  discountType: string;
  discountValue: number;
  minPurchase: number;
  maxDiscount: number;
  product: {
    name: string;
  } | null;
  isShippingVoucher: boolean;
  expiryDate: string;
}

const VoucherList: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const { data } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchVouchers();
        setVouchers(data);
      } catch (error) {
        console.error('Error fetching vouchers:', error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteVoucher = async (id: number) => {
    try {
      await deleteVoucherById(id);
      setVouchers(vouchers.filter((voucher) => voucher.id !== id));
      alert('Voucher deleted successfully');
    } catch (error) {
      alert('Error deleting voucher');
    }
  };

  return (
    <div className="flex flex-col">
      {data?.user?.role == 'SUPER_ADMIN' || data?.user?.role == 'ADMIN' ? (
        <>
          <div className="mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Voucher List</h2>
            <NewVoucher />
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount Type</th>
                  <th>Discount Value</th>
                  <th>Minimum Purchase</th>
                  <th>Maximum Discount</th>
                  <th>Product Name</th>
                  <th>Shipping Voucher?</th>
                  <th>Expiry Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vouchers.length > 0 ? (
                  vouchers.map((voucher: Voucher) => (
                    <tr key={voucher.id} className="hover:bg-gray-100">
                      <td>{voucher.code}</td>
                      <td>{voucher.discountType}</td>
                      <td>{voucher.discountValue}</td>
                      <td>{voucher.minPurchase}</td>
                      <td>{voucher.maxDiscount}</td>
                      <td>{voucher.product?.name || 'No product assigned'}</td>
                      <td>{voucher.isShippingVoucher ? 'Yes' : 'No'}</td>
                      <td>
                        {new Date(voucher.expiryDate).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          className="btn btn-error btn-sm"
                          onClick={() => handleDeleteVoucher(voucher.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center">
                      No vouchers available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>{' '}
        </>
      ) : (
        <>
          <div className="flex justify-center items-center flex-col p-3">
            <h2 className="text-3xl text-center my-2">
              You Don't have an access to this page.
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
  );
};

export default VoucherList;
