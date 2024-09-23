'use client';

import React, { useEffect, useState } from 'react';
import { NewVoucher } from '@/components/Voucher/ButtonAddVoucher';
import { fetchVouchers, deleteVoucherById } from '@/api/vouchers';

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
                <td>{new Date(voucher.expiryDate).toLocaleDateString()}</td>
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
    </div>
  );
};

export default VoucherList;
