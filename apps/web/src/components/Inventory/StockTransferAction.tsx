'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { StockTransfer, Warehouse } from '@/types/stockTransfer';
import { getWarehouses } from '@/api/warehouse';

const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

interface StockTransferActionsProps {
  selectedTransfer: StockTransfer | null;
  isModalOpen: boolean;
  closeModal: () => void;
  onApprove: (
    transferId: number,
    sourceWarehouseId: number,
    stockProcess: number,
  ) => void;
  onReject: (transferId: number) => void;
}

const StockTransferActions: React.FC<StockTransferActionsProps> = ({
  selectedTransfer,
  isModalOpen,
  closeModal,
  onApprove,
  onReject,
}) => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(
    null,
  );
  const [stockProcess, setStockProcess] = useState<number | null>(null);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const res = await getWarehouses();
        setWarehouses(res);
      } catch (error) {
        console.error('Error fetching warehouses:', error);
      }
    };

    fetchWarehouses();
  }, []);

  const handleApprove = async () => {
    if (
      selectedTransfer &&
      selectedWarehouse !== null &&
      stockProcess !== null
    ) {
      try {
        await axios.post(
          `${API_URL}stock-transfers/approve/${selectedTransfer.id}`,
          {
            sourceWarehouseId: selectedWarehouse,
            stockProcess,
            destinationWarehouseId: selectedTransfer.destinationWarehouseId,
          },
        );
        onApprove(selectedTransfer.id, selectedWarehouse, stockProcess);
      } catch (error) {
        console.error('Error approving transfer:', error);
      } finally {
        closeModal();
      }
    }
  };

  const handleReject = async () => {
    if (selectedTransfer) {
      try {
        await axios.put(
          `${API_URL}stock-transfers/reject/${selectedTransfer.id}`,
        );
        onReject(selectedTransfer.id);
      } catch (error) {
        console.error('Error rejecting transfer:', error);
      } finally {
        closeModal();
      }
    }
  };

  if (!selectedTransfer) return null;

  return (
    <div className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Stock Transfer Approval</h3>
        <p className="py-4">
          Select the source warehouse for the transfer and input the stock to
          process.
        </p>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Source Warehouse</span>
          </label>
          <select
            className="select select-bordered"
            value={selectedWarehouse || ''}
            onChange={(e) => setSelectedWarehouse(parseInt(e.target.value))}
          >
            <option disabled selected value="">
              Select a Warehouse
            </option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Stock Process</span>
          </label>
          <input
            type="number"
            className="input input-bordered"
            value={stockProcess || ''}
            onChange={(e) => setStockProcess(parseInt(e.target.value))}
            placeholder="Enter stock process quantity"
          />
        </div>

        <div className="modal-action mt-4">
          <button className="btn btn-error" onClick={handleReject}>
            Reject
          </button>
          <button
            className="btn btn-success"
            onClick={handleApprove}
            disabled={
              !selectedWarehouse || stockProcess === null || stockProcess <= 0
            }
          >
            Approve
          </button>
          <button className="btn" onClick={closeModal}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockTransferActions;
