'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrder } from '@/context/OrderContext';
import WithAuth from '@/components/WithAuth';
import axios from 'axios';

const InvoiceUploadPage = () => {
  const { id } = useParams();
  const { uploadProof, cancelOrder } = useOrder();
  const [order, setOrder] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(3600); // 1 hour in seconds
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        );
        setOrder(response.data);
        // Calculate time left based on order creation time
        const creationTime = new Date(response.data.createdAt).getTime();
        const currentTime = new Date().getTime();
        const elapsedTime = Math.floor((currentTime - creationTime) / 1000);
        setTimeLeft(Math.max(3600 - elapsedTime, 0));
      } catch (error) {
        console.error('Failed to fetch order', error);
        setError('Failed to load order details');
      }
    };

    fetchOrder();
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && order) {
      handleAutoCancel();
    }
  }, [timeLeft, order]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 1024 * 1024) {
        setError('File size must not exceed 1MB');
        setFile(null);
      } else if (!['image/jpeg', 'image/png'].includes(selectedFile.type)) {
        setError('File must be in JPG, JPEG, or PNG format');
        setFile(null);
      } else {
        setError(null);
        setFile(selectedFile);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      await uploadProof(Number(id), file);
      alert('Payment proof uploaded successfully');
      router.push('/orders'); // Redirect to orders page after successful upload
    } catch (error) {
      console.error('Failed to upload payment proof', error);
      setError('Failed to upload payment proof. Please try again.');
    }
  };

  const handleAutoCancel = async () => {
    try {
      await cancelOrder(Number(id), 'SYSTEM');
      alert('Order has been automatically cancelled due to payment timeout.');
      router.push('/orders');
    } catch (error) {
      console.error('Failed to auto-cancel order', error);
      setError('Failed to cancel order. Please contact support.');
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Payment Proof</h1>
      <p className="mb-4">Order ID: {id}</p>
      <p className="mb-4">
        Time left to upload: {Math.floor(timeLeft / 60)}:
        {(timeLeft % 60).toString().padStart(2, '0')}
      </p>

      <div className="mb-4">
        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="mb-2"
        />
        {error && <p className="text-red-500">{error}</p>}
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || timeLeft <= 0}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        Upload Payment Proof
      </button>

      {timeLeft <= 0 && (
        <p className="text-red-500 mt-4">
          Time expired. Your order has been automatically cancelled.
        </p>
      )}
    </div>
  );
};

export default WithAuth(InvoiceUploadPage);
