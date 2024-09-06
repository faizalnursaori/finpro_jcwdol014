import React from 'react';

interface ConfirmationDeleteCartProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmationDeleteCart: React.FC<ConfirmationDeleteCartProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirm Deletion</h3>
        <p className="py-4">
          Are you sure you want to remove this item from your cart?
        </p>
        <div className="modal-action">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
