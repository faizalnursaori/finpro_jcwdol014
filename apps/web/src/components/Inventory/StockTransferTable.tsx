'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { getWarehouseByUserId } from '@/api/warehouse';
import { StockTransfer } from '@/types/stockTransfer';
import StockTransferActions from './StockTransferAction';

const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

const TransferStatusBadge = ({ status }: { status: string }) => {
  let badgeColor = 'badge-neutral';
  if (status === 'PENDING') badgeColor = 'badge-warning';
  else if (status === 'COMPLETED') badgeColor = 'badge-success';
  else if (status === 'REJECTED') badgeColor = 'badge-error';

  return <div className={`badge ${badgeColor}`}>{status}</div>;
};

export default function StockTransferTable() {
  const [stockTransfers, setStockTransfers] = useState<StockTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const { data } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] =
    useState<StockTransfer | null>(null);

  useEffect(() => {
    const fetchStockTransfers = async () => {
      try {
        let res;

        if (data?.user?.role === 'SUPER_ADMIN') {
          res = await axios.get(`${API_URL}stock-transfers`);
        } else if (data?.user?.role === 'ADMIN') {
          const warehouse = await getWarehouseByUserId(data.user.id);
          if (warehouse) {
            res = await axios.get(`${API_URL}stock-transfers/${warehouse.id}`);
          } else {
            console.error('Warehouse not found for this admin');
            return;
          }
        }

        if (res) {
          setStockTransfers(res.data);
        }
      } catch (error) {
        console.error('Error fetching stock transfers:', error);
      } finally {
        setLoading(false);
      }
    };

    if (data) {
      fetchStockTransfers();
    }
  }, [data]);

  const handleActionChange = (transfer: StockTransfer, action: string) => {
    if (action === 'APPROVE' || action === 'REJECT') {
      setSelectedTransfer(transfer);
      setIsModalOpen(true);
    }
  };

  const handleApprove = (
    transferId: number,
    sourceWarehouseId: number,
    stockProcess: number,
  ) => {
    setStockTransfers((prevTransfers) =>
      prevTransfers.map((transfer) =>
        transfer.id === transferId
          ? { ...transfer, status: 'COMPLETED', stockProcess }
          : transfer,
      ),
    );
  };

  const handleReject = (transferId: number) => {
    setStockTransfers((prevTransfers) =>
      prevTransfers.map((transfer) =>
        transfer.id === transferId
          ? { ...transfer, status: 'REJECTED' }
          : transfer,
      ),
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <progress className="progress w-56"></progress>
      </div>
    );
  }

  if (stockTransfers.length === 0) {
    return (
      <div className="text-center mt-5">
        <p className="text-lg">No stock transfers available.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table w-full table-zebra">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product Name</th>
            <th>Source Warehouse</th>
            <th>Destination Warehouse</th>
            <th>Stock Request</th>
            <th>Stock Process</th>
            <th>Note</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Updated At</th>
            {data?.user?.role === 'SUPER_ADMIN' ? <th>Action</th> : null}
          </tr>
        </thead>
        <tbody>
          {stockTransfers.map((transfer) => (
            <tr key={transfer.id}>
              <td>{transfer.id}</td>
              <td>{transfer.product.name}</td>
              <td>{transfer.sourceWarehouse?.name}</td>
              <td>{transfer.destinationWarehouse?.name}</td>
              <td>{transfer.stockRequest}</td>
              <td>{transfer.stockProcess || '-'}</td>
              <td>{transfer.note}</td>
              <td>
                <TransferStatusBadge status={transfer.status} />
              </td>
              <td>{new Date(transfer.createdAt).toLocaleString()}</td>
              <td>{new Date(transfer.updatedAt).toLocaleString()}</td>
              <td>
                {data?.user?.role === 'SUPER_ADMIN' ? (
                  <select
                    className="select select-bordered"
                    value="Action"
                    onChange={(e) =>
                      handleActionChange(transfer, e.target.value)
                    }
                  >
                    <option disabled value="Action">
                      Select Action
                    </option>
                    <option value="APPROVE">APPROVE</option>
                    <option value="REJECT">REJECT</option>
                  </select>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <StockTransferActions
        selectedTransfer={selectedTransfer}
        isModalOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
