'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

const PaymentUploadPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !orderId) {
      alert('Please upload a file or provide a valid order ID.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('orderId', orderId);

    try {
      setIsUploading(true);
      const token = localStorage.getItem('token');

      await axios.post(
        'http://localhost:8000/api/orders/payment-proof',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      alert('Payment proof uploaded successfully!');
      router.push('/order/success');
    } catch (error) {
      console.error('Failed to upload payment proof:', error);
      alert('Failed to upload payment proof. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Payment Proof</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Upload Payment Receipt:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isUploading || !file}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {isUploading ? 'Uploading...' : 'Upload Proof'}
        </button>
      </form>
    </div>
  );
};

export default PaymentUploadPage;