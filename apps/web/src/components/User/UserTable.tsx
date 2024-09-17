'use client';

import { useState, useEffect } from 'react';
import { getAllUser, searchUser } from '@/api/user';
import { Search } from '../Search';
import { Pagination } from '../Pagination';
import { ErrorAlert } from '../ErrorAlert';
import Image from 'next/image';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  gender: string;
  image: string;
  isVerified: boolean;
  mobileNumber: string;
  dob: Date;
}

export const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit] = useState<number>(5);

  const fetchUsers = async (page: number) => {
    setLoading(true);
    try {
      const res = await getAllUser(page, limit);
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

  const handleSearch = async (query: string) => {
    try {
      const res = await searchUser(query);
      if (!res.ok) {
        throw new Error('Failed to search user');
      }
      setUsers(res.data.user);
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
        </div>
        <table className="table w-full">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Mobile Number</th>
              <th>Date of Birth</th>
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
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <Image
                          src={user.image}
                          alt="User Avatar"
                          width={100}
                          height={100}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{user.name}</div>
                      <div className="text-sm opacity-50">{user.gender}</div>
                    </div>
                  </div>
                </td>
                <td>{user.username}</td>
                <td>
                  {user.email}
                  <br />
                  <span className="badge badge-ghost badge-sm">
                    {user.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </td>
                <td>{user.mobileNumber}</td>
                <td>
                  {user.dob ? new Date(user.dob).toLocaleDateString() : ''}
                </td>
                <td>{user.role}</td>
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
    </>
  );
};
