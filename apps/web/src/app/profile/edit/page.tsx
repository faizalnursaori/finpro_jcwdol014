'use client';
import { SquarePen, BadgeCheck } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { editUser } from '@/api/user';

export default function Edit() {
  const [user, setUser] = useState({});
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await editUser(user.id, data);
      const updatedData = {...user, ...data}
      localStorage.setItem('userInfo', JSON.stringify(updatedData))
      toast.success('Profile Updated!');
      router.push('/profile');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem('userInfo');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <>
      <Toaster />
      <div className="card card-compact bg-base-100 shadow-xl h-fit w-[40vw] p-5">
        <div>
          <form className="form-control gap-4" onSubmit={handleSubmit}>
            <div className="form-control flex focus-within:border-white">
              <span className="label-text font-medium text-xs pl-1">
                New Avatar
              </span>
              <input
                onChange={handleChange}
                type="file"
                name="image"
                id="image"
                accept=".jpg, .png, .jpeg"
                className="file-input"
                placeholder="Update Avatar"
              />
            </div>
            <div className="form-control relative focus-within:border-white">
              <input
                onChange={handleChange}
                type="text"
                name="username"
                id="username"
                placeholder=""
                className="peer input input-bordered relative z-0 w-full focus:outline-none"
              />
              <label
                htmlFor="username"
                className="label pointer-events-none absolute left-3 top-1 select-none px-1 transition-all duration-300 peer-focus:-translate-y-[21px] peer-focus:text-xs peer-[:not(:placeholder-shown)]:-translate-y-[21px] peer-[:not(:placeholder-shown)]:text-xs"
              >
                <span className="bg-base-100 px-1">New Username</span>
              </label>
            </div>
            <div className="form-control relative focus-within:border-white">
              <input
                onChange={handleChange}
                type="email"
                name="email"
                id="email"
                placeholder=" "
                className="peer input input-bordered relative z-0 w-full focus:outline-none"
              />
              <label
                htmlFor="email"
                className="label pointer-events-none absolute left-3 top-1 select-none px-1 transition-all duration-300 peer-focus:-translate-y-[21px] peer-focus:text-xs peer-[:not(:placeholder-shown)]:-translate-y-[21px] peer-[:not(:placeholder-shown)]:text-xs"
              >
                <span className="bg-base-100 px-1">New Email</span>
              </label>
            </div>
            <div className="form-control mt-4">
              <button
                className="btn btn-success mb-4 text-base-100"
                disabled={isLoading}
              >
                {isLoading ? 'Submiting' : 'Submit'}
              </button>

              <div className="mt-4 flex w-80 flex-col items-center justify-center gap-8"></div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
