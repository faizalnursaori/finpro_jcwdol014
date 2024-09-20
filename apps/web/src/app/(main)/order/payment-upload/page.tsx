'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';

const PaymentUploadPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const maxSize = 1 * 1024 * 1024; // 1MB in bytes

    const fileExtension = file.name
      .toLowerCase()
      .slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2);

    if (!allowedExtensions.includes(`.${fileExtension}`)) {
      setErrorMessage(
        'Invalid file type. Only .jpg, .jpeg, and .png files are allowed.',
      );
      return false;
    }

    if (file.size > maxSize) {
      setErrorMessage('File size exceeds 1MB. Please choose a smaller file.');
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      } else {
        setFile(null);
        e.target.value = ''; // Reset file input
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !orderId) {
      alert('Please upload a valid file or provide a valid order ID.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('orderId', orderId);

    try {
      setIsUploading(true);
      const token = Cookies.get('token');

      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/orders/payment-proof`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      alert('Payment proof uploaded successfully!');
      router.push(`/order/success?orderId=${orderId}`);
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
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Allowed file types: .jpg, .jpeg, .png. Maximum file size: 1MB.
          </p>
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
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
