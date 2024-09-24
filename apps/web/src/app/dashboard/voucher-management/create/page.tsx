'use client';

import React, { useState, useEffect } from 'react';
import { getProducts } from '@/api/products';
import { createVoucher } from '@/api/vouchers';
import { useRouter } from 'next/navigation';

const CreateVoucherForm: React.FC = () => {
  const [voucherData, setVoucherData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: 0,
    minPurchase: 0,
    maxDiscount: 0,
    isShippingVoucher: false,
    expiryDate: '',
    applicableProduct: 0 || null,
  });

  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts.products);
      } catch (error) {
        console.error(error.message);
      }
    };

    loadProducts();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type, checked } = e.target;
    const newValue =
      type === 'number'
        ? parseFloat(value)
        : type === 'checkbox'
          ? checked
          : name === 'applicableProduct'
            ? parseInt(value, 10) || 0
            : value;
    setVoucherData({ ...voucherData, [name]: newValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedData = {
      ...voucherData,
      discountValue: parseFloat(voucherData.discountValue as unknown as string),
      minPurchase: parseFloat(voucherData.minPurchase as unknown as string),
      maxDiscount: parseFloat(voucherData.maxDiscount as unknown as string),
      productId: voucherData.applicableProduct
        ? parseInt(voucherData.applicableProduct as unknown as string, 10)
        : null,
    };

    try {
      await createVoucher(formattedData);
      router.push('/dashboard/voucher-management');
    } catch (error) {
      alert('Error creating voucher: ' + error.message);
    }
  };

  return (
    <div className="mx-auto min-w-96 mt-8 overflow-x-auto ">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Voucher</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Voucher Code</span>
          </label>
          <input
            type="text"
            name="code"
            placeholder="Enter voucher code"
            value={voucherData.code}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Discount Type</span>
          </label>
          <select
            name="discountType"
            value={voucherData.discountType}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED">Fixed Amount</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Discount Value</span>
          </label>
          <input
            type="number"
            name="discountValue"
            placeholder="Enter discount value"
            value={voucherData.discountValue}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Minimum Purchase Amount</span>
          </label>
          <input
            type="number"
            name="minPurchase"
            placeholder="Enter minimum purchase amount"
            value={voucherData.minPurchase}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Maximum Discount Amount</span>
          </label>
          <input
            type="number"
            name="maxDiscount"
            placeholder="Enter maximum discount amount"
            value={voucherData.maxDiscount}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        {/* Select a single product */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Apply to Product</span>
          </label>
          <select
            name="applicableProduct"
            value={voucherData.applicableProduct}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="">Select a product</option>
            {products.map((product: any) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="cursor-pointer label">
            <span className="label-text">Is Shipping Voucher</span>
            <input
              type="checkbox"
              name="isShippingVoucher"
              checked={voucherData.isShippingVoucher}
              onChange={handleChange}
              className="checkbox checkbox-primary"
            />
          </label>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Expiry Date</span>
          </label>
          <input
            type="date"
            name="expiryDate"
            value={voucherData.expiryDate}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control mt-6">
          <button type="submit" className="btn btn-primary w-full">
            Create Voucher
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateVoucherForm;
