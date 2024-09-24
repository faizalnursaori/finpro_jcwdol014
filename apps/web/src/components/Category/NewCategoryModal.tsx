import React, { useState } from 'react';
import { createCategory } from '@/api/category';
import { Category } from './CategoryTable';

interface NewCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newCategory: Category) => void;
}

export const NewCategoryModal: React.FC<NewCategoryModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSaveCreate = async () => {
    setError(null);
    setSuccess(null);

    const newCategory = {
      name,
      slug,
    };

    try {
      const res = await createCategory(newCategory);
      if (!res.ok) {
        throw new Error(res.message || 'Failed to update category');
      }
      onAdd(res.data.data as Category);
      setSuccess('Category added successfully!');
      setTimeout(() => {
        onClose();
        setName('');
        setSlug('');
        setSuccess(null);
      }, 1000);
    } catch (error) {
      setError((error as Error).message || 'Failed to create category');
    }
  };

  return (
    <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">New Category</h3>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="form-control">
          <label className="label">Category Name</label>
          <input
            type="text"
            className="input input-bordered"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-control">
          <label className="label">Slug</label>
          <input
            type="text"
            className="input input-bordered"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </div>

        <div className="modal-action">
          <button className="btn" onClick={handleSaveCreate}>
            Save
          </button>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
