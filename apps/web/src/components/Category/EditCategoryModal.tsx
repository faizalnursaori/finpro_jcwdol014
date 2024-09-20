import React, { useState, useEffect } from 'react';
import { updateCategory } from '@/api/category';
import { Category } from './CategoryTable';

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSave: (updatedCategory: Category) => void;
}

export const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  onSave,
}) => {
  const [name, setName] = useState(category?.name || '');
  const [slug, setSlug] = useState(category?.slug || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug);
    }
  }, [category]);

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    if (category) {
      const updatedCategory = {
        id: category.id,
        name,
        slug,
      };

      try {
        const res = await updateCategory(category.id, updatedCategory);
        if (!res.ok) {
          throw new Error(res.message || 'Failed to update category');
        }
        onSave(updatedCategory as Category);
        setSuccess('Category updated successfully!');

        setTimeout(() => {
          onClose();
          setName('');
          setSlug('');
          setSuccess(null);
        }, 1000);
      } catch (error) {
        setError((error as Error).message);
      }
    }
  };

  return (
    <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Edit Category</h3>

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
          <button className="btn" onClick={handleSave}>
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
