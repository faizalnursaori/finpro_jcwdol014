import React, { useState } from 'react';
import { useOrder } from '@/context/OrderContext';
import { toast } from 'react-hot-toast';

interface PaymentProofUploadProps {
  orderId: number;
}

const PaymentProofUpload: React.FC<PaymentProofUploadProps> = ({ orderId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { uploadProof } = useOrder();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 1024 * 1024) {
        setError('File size must be less than 1MB');
        setFile(null);
      } else if (!['image/jpeg', 'image/png'].includes(selectedFile.type)) {
        setError('File must be .jpg, .jpeg, or .png');
        setFile(null);
      } else {
        setError(null);
        setFile(selectedFile);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    try {
      await uploadProof(orderId, file);
      toast.success('Payment proof uploaded successfully');
    } catch (error) {
      console.error('Upload failed', error);
      toast.error('Failed to upload payment proof. Please try again.');
    }
  };

  return (
    <div className="mt-4 p-4 border rounded">
      <h3 className="text-lg font-semibold mb-2">Upload Payment Proof</h3>
      <input
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={handleFileChange}
        className="mb-2"
      />
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button
        onClick={handleUpload}
        disabled={!file}
        className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        Upload Proof
      </button>
    </div>
  );
};

export default PaymentProofUpload;
