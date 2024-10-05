import React, { useState, useEffect } from 'react';

interface CustomDateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (startDate: string, endDate: string) => void;
  initialStartDate: string;
  initialEndDate: string;
}

const CustomDateRangeModal: React.FC<CustomDateRangeModalProps> = ({
  isOpen,
  onClose,
  onApply,
  initialStartDate,
  initialEndDate,
}) => {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  useEffect(() => {
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
  }, [initialStartDate, initialEndDate]);

  const handleApply = () => {
    onApply(startDate, endDate);
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Select Custom Date Range</h3>
        <div className="py-4">
          <div className="mb-4">
            <label className="block mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
        </div>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomDateRangeModal;
