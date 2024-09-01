'use client';

import { useState } from 'react';

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

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (updatedUser: User) => void;
}

export const EditUserModal = ({
  isOpen,
  onClose,
  user,
  onSave,
}: EditUserModalProps) => {
  const [updatedUser, setUpdatedUser] = useState<User>(user);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(updatedUser);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Edit User</h3>
        <div className="form-control">
          <label className="label">Name</label>
          <input
            type="text"
            name="name"
            value={updatedUser.name}
            onChange={handleChange}
            className="input input-bordered"
          />
        </div>
        <div className="form-control">
          <label className="label">Username</label>
          <input
            type="text"
            name="username"
            value={updatedUser.username}
            onChange={handleChange}
            className="input input-bordered"
          />
        </div>
        <div className="form-control">
          <label className="label">Email</label>
          <input
            type="email"
            name="email"
            value={updatedUser.email}
            onChange={handleChange}
            className="input input-bordered"
          />
        </div>
        <div className="form-control">
          <label className="label">Phone Number</label>
          <input
            type="text"
            name="mobileNumber"
            value={updatedUser.mobileNumber}
            onChange={handleChange}
            className="input input-bordered"
          />
        </div>
        <div className="modal-action">
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
