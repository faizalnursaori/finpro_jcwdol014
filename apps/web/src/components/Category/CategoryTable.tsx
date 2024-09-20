'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  deleteCategory,
  getCategoriesByPage,
  searchCategory,
} from '@/api/category';
import { DeleteCategoryModal } from './DeleteCategoryModal';
import { Search } from '../Search';
import { Pagination } from '../Pagination';
import { EditCategoryModal } from './EditCategoryModal';
import { NewCategoryModal } from './NewCategoryModal';
import { ButtonAddCategory } from './ButtonAddCategory';
import toast, { Toaster } from 'react-hot-toast';

export interface Category {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
}

export const CategoryTable = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [isNewModalOpen, setNewModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit] = useState<number>(5);
  const { data } = useSession();

  const fetchCategories = async (page: number) => {
    setLoading(true);
    try {
      const res = await getCategoriesByPage(page, limit);
      if (!res.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = res.data;
      setCategories(data.categories);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage]);

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const handleSave = async (updatedCategory: Category) => {
    const updatedCategories = categories.map((cat) =>
      cat.id === updatedCategory.id ? { ...cat, ...updatedCategory } : cat,
    );
    setCategories(updatedCategories);
    setEditModalOpen(false);
  };

  const handleAdd = (newCategory: Category) => {
    setCategories([newCategory, ...categories]);
  };

  const handleDelete = async () => {
    if (selectedCategory) {
      try {
        const res = await deleteCategory(selectedCategory.id);
        if (!res.ok) {
          throw new Error('Failed to delete category');
        }
        setCategories(
          categories.filter((category) => category.id !== selectedCategory.id),
        );
        setDeleteModalOpen(false);
        setSelectedCategory(null);
      } catch (error) {
        toast.error((error as Error).message);
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedCategory(null);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedCategory(null);
  };

  const handleCloseNewModal = () => {
    setNewModalOpen(false);
  };

  const handleSearch = async (query: string) => {
    try {
      const res = await searchCategory(query);
      if (!res.ok) {
        throw new Error('Failed to search category');
      }
      setCategories(res.data.categories);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleClearSearch = () => {
    fetchCategories(currentPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <span className="loading loading-bars loading-lg"></span>;

  return (
    <>
      <Toaster />
      <div className="overflow-x-auto">
        <div className="flex flex-row justify-between my-3 mx-3 gap-10">
          <Search onSearch={handleSearch} onClear={handleClearSearch} />
          {data?.user?.role === 'SUPER_ADMIN' ? (
            <ButtonAddCategory onClick={() => setNewModalOpen(true)} />
          ) : (
            ''
          )}
        </div>
        <table className="table w-full">
          <thead>
            <tr>
              <th>Id</th>
              <th>Category Name</th>
              <th>Slug</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={index}>
                <td>{category.id}</td>
                <td>
                  <div className="font-bold">{category.name}</div>
                </td>
                <td>{category.slug}</td>
                {data?.user?.role === 'SUPER_ADMIN' ? (
                  <th>
                    <button
                      className={`btn btn-ghost btn-xs`}
                      onClick={() => handleEditClick(category)}
                    >
                      Edit
                    </button>
                    <button
                      className={`btn btn-ghost btn-xs`}
                      onClick={() => handleDeleteClick(category)}
                    >
                      Delete
                    </button>
                  </th>
                ) : (
                  ''
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {selectedCategory && isDeleteModalOpen && (
        <DeleteCategoryModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onDelete={handleDelete}
        />
      )}

      {selectedCategory && isEditModalOpen && (
        <EditCategoryModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          category={selectedCategory}
          onSave={handleSave}
        />
      )}

      {isNewModalOpen && (
        <NewCategoryModal
          isOpen={isNewModalOpen}
          onClose={handleCloseNewModal}
          onAdd={handleAdd}
        />
      )}
    </>
  );
};
