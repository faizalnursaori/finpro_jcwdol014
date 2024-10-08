'use client';

interface DeleteWarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export const DeleteStoreButton = ({
  isOpen,
  onClose,
  onDelete,
}: DeleteWarehouseModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          Are you sure you want to delete this store?
        </h3>
        <p>It will delete all of the store data.</p>
        <div className="modal-action">
          <button className="btn btn-error" onClick={onDelete}>
            Delete
          </button>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};