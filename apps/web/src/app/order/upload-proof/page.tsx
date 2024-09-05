'use client';

import { useState } from 'react';
import { useOrder } from '@/context/OrderContext';

const UploadProofPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const { uploadProof } = useOrder();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }

    try {
      const orderId = 1; // replace with actual order ID
      await uploadProof(orderId, file);
      alert('Proof uploaded successfully');
    } catch (error) {
      console.error('Failed to upload proof', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Upload Payment Proof</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} className="btn btn-primary mt-4">
        Upload Proof
      </button>
    </div>
  );
};

export default UploadProofPage;
