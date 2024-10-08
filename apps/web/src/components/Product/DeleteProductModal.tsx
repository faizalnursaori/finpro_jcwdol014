'use client';

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export const DeleteProductModal = ({
  isOpen,
  onClose,
  onDelete,
}: DeleteProductModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          Are you sure you want to delete this product?
        </h3>
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
