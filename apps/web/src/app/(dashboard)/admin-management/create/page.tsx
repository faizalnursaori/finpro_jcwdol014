'use client';

import React, { ChangeEvent, FormEvent, useState } from 'react';
import { createAdmin } from '@/api/admin';
import { ErrorAlert } from '@/components/ErrorAlert';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export interface FormData {
  name: string;
  email: string;
  mobileNumber: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: string;
  isVerified: boolean;
}

const CreatePage: React.FC = () => {
  const {data} = useSession()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    mobileNumber: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'ADMIN',
    isVerified: true,
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await createAdmin(formData);
      window.location.href = '/admin-management';
    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message);
    }
  };

  return (
    <div className="content-wrapper">
      {data?.user?.role == "SUPER_ADMIN" ? <><div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Create Admin</h3>
          <div
            aria-label="Breadcrumbs"
            className="breadcrumbs text-sm hidden p-0 sm:inline"
          >
            <ul>
              <li>Dashboard</li>
              <li>
                <a href="/admin-management">Admin Management</a>
              </li>
              <li>Create</li>
            </ul>
          </div>
        </div>
        <div className="mt-5">
          {error && <ErrorAlert message={error} />}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <div aria-label="Card" className="card bg-base-100 card-bordered">
                <div className="card-body gap-0">
                  <div className="card-title">Basic Information</div>
                  <div className="mt-1 grid grid-cols-1 gap-5 gap-y-3 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="label">
                        <span className="label-text cursor-pointer">Name</span>
                      </label>
                      <div className="form-control flex flex-row items-center rounded-box border border-base-content/20">
                        <input
                          id="name"
                          placeholder="Name"
                          className="input w-full transition-all input-sm input-bordered focus:outline-offset-0"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="label">
                        <span className="label-text cursor-pointer">Email</span>
                      </label>
                      <div className="form-control flex flex-row items-center rounded-box border border-base-content/20">
                        <input
                          id="email"
                          placeholder="Email"
                          className="input w-full transition-all input-sm input-bordered focus:outline-offset-0"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <div>
                        <label htmlFor="username" className="label">
                          <span className="label-text cursor-pointer">
                            Username
                          </span>
                        </label>
                        <div className="form-control flex flex-row items-center rounded-box border border-base-content/20">
                          <input
                            id="username"
                            placeholder="Username"
                            className="input w-full transition-all input-sm input-bordered focus:outline-offset-0"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                          ></input>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div>
                        <label htmlFor="mobileNumber" className="label">
                          <span className="label-text cursor-pointer">
                            Phone Number
                          </span>
                        </label>
                        <div className="form-control flex flex-row items-center rounded-box border border-base-content/20">
                          <input
                            id="mobileNumber"
                            placeholder="Phone Number"
                            className="input w-full transition-all input-sm input-bordered focus:outline-offset-0"
                            name="mobileNumber"
                            value={formData.mobileNumber}
                            onChange={handleChange}
                          ></input>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div aria-label="Card" className="card bg-base-100 card-bordered">
                <div className="card-body gap-0">
                  <div className="card-title">Create Password</div>
                  <div className="mt-1 grid grid-cols-1 gap-5 gap-y-3 md:grid-cols-2">
                    <div>
                      <label htmlFor="password" className="label">
                        <span className="label-text cursor-pointer">
                          Password
                        </span>
                      </label>
                      <div className="form-control flex flex-row items-center rounded-box border border-base-content/20 pe-3">
                        <input
                          id="password"
                          autoComplete="on"
                          type="password"
                          placeholder="Password"
                          className="input w-full border-0 focus:outline-0 transition-all input-sm input-bordered focus:outline-offset-0"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <button
                          type="button"
                          aria-label="Show/Hide password"
                          className="btn hover:bg-base-content/10 btn-xs btn-circle btn-ghost"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            role="img"
                            className="text-base-content/80"
                            fontSize="16"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M12 5a7 7 0 0 0-6.338 4.322c-.166.458-.166.93 0 1.388A7 7 0 0 0 12 19a7 7 0 0 0 6.338-4.322c.166-.458.166-.93 0-1.388A7 7 0 0 0 12 5zm0 10.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zM12 8.5a3.5 3.5 0 0 0-3.5 3.5c0 .664.223 1.277.594 1.782a5.982 5.982 0 0 1 4.812 0A3.5 3.5 0 0 0 12 8.5z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="label">
                        <span className="label-text cursor-pointer">
                          Confirm Password
                        </span>
                      </label>
                      <div className="form-control flex flex-row items-center rounded-box border border-base-content/20 pe-3">
                        <input
                          id="confirmPassword"
                          autoComplete="on"
                          type="password"
                          placeholder="Confirm Password"
                          className="input w-full border-0 focus:outline-0 transition-all input-sm input-bordered focus:outline-offset-0"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                        <button
                          type="button"
                          aria-label="Show/Hide password"
                          className="btn hover:bg-base-content/10 btn-xs btn-circle btn-ghost"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            role="img"
                            className="text-base-content/80"
                            fontSize="16"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M12 5a7 7 0 0 0-6.338 4.322c-.166.458-.166.93 0 1.388A7 7 0 0 0 12 19a7 7 0 0 0 6.338-4.322c.166-.458.166-.93 0-1.388A7 7 0 0 0 12 5zm0 10.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zM12 8.5a3.5 3.5 0 0 0-3.5 3.5c0 .664.223 1.277.594 1.782a5.982 5.982 0 0 1 4.812 0A3.5 3.5 0 0 0 12 8.5z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <button type="submit" className="btn btn-primary">
                Save
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-4"
                aria-label="Cancel"
                onClick={() => (window.location.href = '/admin-management')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div></> : <>
            <div className='flex justify-center items-center flex-col p-3'>
            <h2 className="text-3xl text-center my-2">
              You Don't have an access to this page.
            </h2>
            <div className="mt-4 flex w-80 items-center justify-center gap-8">
              <Link
                className="relative flex items-center justify-center text-xl no-underline outline-none transition-opacity hover:opacity-80 active:opacity-60"
                href="/"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="m12 19-7-7 7-7"></path>
                  <path d="M19 12H5"></path>
                </svg>
                <span className="flex items-center">Back to Homepage</span>
              </Link>
            </div>
            </div>
          </>}
    </div>
  );
};

export default CreatePage;
