'use client';

import { useState, useEffect } from 'react';
import { EditUserModal } from './EditUserModal';
import { deleteAdmin, getAllAdmin, searchUser, updateUser } from '@/api/admin';
import { DeleteUserModal } from './DeleteUserModal';
import { Search } from '../Search';
import { NewUser } from './ButtonAdd';
import { Pagination } from '../Pagination';
import { ErrorAlert } from '../ErrorAlert';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  gender: string;
  avatarUrl: string;
  location: string;
  isVerified: boolean;
  mobileNumber: string;
}

export const AdminTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit] = useState<number>(5); // Change this value if you want a different limit per page

  const fetchUsers = async (page: number) => {
    setLoading(true);
    try {
      const res = await getAllAdmin(page, limit);
      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = res.data;
      setUsers(data.user);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleSave = async (updatedUser: Partial<User>) => {
    try {
      const res = await updateUser(updatedUser.id as number, updatedUser);
      if (!res.ok) {
        throw new Error(res.message);
      }
      const updatedUsers = users.map((user) =>
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user,
      );
      setUsers(updatedUsers);
      setEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleDelete = async () => {
    if (selectedUser) {
      try {
        const res = await deleteAdmin(selectedUser.id);
        if (!res.ok) {
          throw new Error('Failed to delete user');
        }
        setUsers(users.filter((user) => user.id !== selectedUser.id));
        setDeleteModalOpen(false);
        setSelectedUser(null);
      } catch (error) {
        setError((error as Error).message);
      }
    }
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleSearch = async (query: string) => {
    try {
      const res = await searchUser(query);
      if (!res.ok) {
        throw new Error('Failed to search user');
      }
      setUsers(res.data);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleClearSearch = () => {
    fetchUsers(currentPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <span className="loading loading-bars loading-lg"></span>;
  if (error) return <ErrorAlert message={error} />;

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex flex-row justify-between my-3 mx-3 gap-10">
          <Search onSearch={handleSearch} onClear={handleClearSearch} />
          <NewUser />
        </div>
        <table className="table w-full">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.id}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content w-12 rounded-full">
                        <span className="text-lg font-bold">
                          {user.name
                            ? user.name
                                .split(' ')
                                .map((word) => word[0])
                                .join('')
                                .toUpperCase()
                            : 'NN'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.mobileNumber}</td>
                <td>{user.role}</td>
                <th>
                  <button
                    className={`btn btn-ghost btn-xs ${
                      user.role === 'USER' ? 'btn-disabled mx-1' : ''
                    }`}
                    onClick={() => handleEditClick(user)}
                  >
                    Edit
                  </button>
                  <button
                    className={`btn btn-ghost btn-xs ${
                      user.role === 'USER' || user.role === 'SUPER_ADMIN'
                        ? 'btn-disabled'
                        : ''
                    }`}
                    onClick={() => handleDeleteClick(user)}
                  >
                    Delete
                  </button>
                </th>
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

      {selectedUser && isEditModalOpen && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          user={selectedUser}
          onSave={handleSave}
        />
      )}
      {selectedUser && isDeleteModalOpen && (
        <DeleteUserModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};
