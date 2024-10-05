'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { DeleteStoreButton } from './DeleteStoreButton';
import { AddStoreButton } from './AddStoreButton';
import { Search } from '../Search';
import { Pagination } from '../Pagination';
import toast, { Toaster } from 'react-hot-toast';
import { getWarehouseByPage, deleteWarehouse, searchWarehouse } from '@/api/warehouse';


interface Warehouse {
  id: number;
  name: string;
  address: string;
  provinceId: number;
  cityId: number;
  userId: number;
  postalCode: number;
  latitude: number;
  longitude: number;
  storeRadius: number;
  createdAt: Date;
  updatedAt: Date;
  user: any
  province: any;
  city:any;
}

export const StoreTable = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit] = useState<number>(5);
  const { data } = useSession();

  const getWarehouse = async (page: number) => {
    setLoading(true);
    try {
      const res = await getWarehouseByPage(page, limit);
      if (!res.ok) {
        toast.error('Failed to get warehouses');
      }
      
      const data = res.data;
    
      setWarehouses(data.warehouses);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWarehouse(currentPage);
  }, [currentPage]);

  const handleDeleteClick = (warehouse: any) => {
    setSelectedWarehouse(warehouse);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedWarehouse) {
      try {
        const res = await deleteWarehouse(selectedWarehouse.id);
        toast.success('Store deleted!')
        setWarehouses(
          warehouses.filter((warehouse) => warehouse.id !== selectedWarehouse.id),
        );
        setDeleteModalOpen(false);
        setSelectedWarehouse(null);
      } catch (error) {
        toast.error((error as Error).message);
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedWarehouse(null);
  };

  const handleSearch = async (query: string) => {
    try {
      const res = await searchWarehouse(query);
      if (!res.ok) {
        toast.error('Warehouse not found.');
      }
      setWarehouses(res.data.warehouses);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleClearSearch = () => {
    getWarehouse(currentPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <span className="loading loading-bars loading-lg"></span>;

  return (
    <>
      <Toaster />
      <div className="overflow-x-auto w-[65vw]">
        <div className="flex flex-row justify-between my-3 mx-3 gap-10">
          {data?.user?.role === 'SUPER_ADMIN' ? <AddStoreButton /> : ''}
        </div>
        <table className="table w-[100%]">
          <thead>
            <tr>
              <th>Id</th>
              <th>Warehouse Name</th>
              <th>Address</th>
              <th>City</th>
              <th>Province</th>
              <th>Admin</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((warehouse, index) => (
              <tr key={index}>
                <td>{warehouse.id}</td>
                <td><Link href={`/dashboard/store-management/details/${warehouse.id}`}>{warehouse.name}</Link></td>
                <td>{warehouse.address}</td>
                <td>{warehouse.city.name}</td>
                <td>{warehouse.province.name}</td>
                <td>{warehouse.user.name ? warehouse.user.name : '-'}</td>
                {data?.user?.role === 'SUPER_ADMIN' ? (
                  <th className='gap-2'>
                    <button className={`btn btn-ghost btn-xs`}>
                      <Link
                        href={`/dashboard/store-management/edit/${warehouse.id}`}
                      >
                        Edit
                      </Link>
                    </button>
                    <button
                      className={`btn btn-ghost hover:btn-outline btn-error hover:text-base-100 btn-xs`}
                      onClick={() => handleDeleteClick(warehouse)}
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

      {selectedWarehouse && isDeleteModalOpen && (
        <DeleteStoreButton
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};