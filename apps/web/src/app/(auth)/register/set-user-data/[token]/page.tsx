'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { editUserByToken } from '@/api/user';
import toast from 'react-hot-toast';

export default function SetUserData() {
  const [data, setData] = useState<any>({});
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [idToken, setIdToken] = useState('')
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useParams()

  
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
    if(e.target.name === 'password') setPassword(e.target.value)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if(!data.name || data.name.length < 3){
      toast.error('Name must be at least 3 characters')
      return
    }

    if(!data.username || data.username.length < 3){
      toast.error('Username must be at least 3 characters')
      return
    }

    if(!data.password || data.password.length < 3){
      toast.error('Password must be at least 3 characters')
      return
    }
    
   
    if(password !== confirmPassword){
        toast.error('Password Unmatched!')
        setIsLoading(!isLoading)
        return
    }

    try {
      setIsLoading(true)
      await editUserByToken(params.token, data);
      setIsLoading(false)
      toast.success('Regristation Success! Welcome to Hemart.')
      router.push('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
      setIsLoading(false)
    }
  };

  return (
    <div className="bg-base-100 flex flex-col justify-center items-center gap-6">
      <h2 className="font-bold text-2xl">COMPLETE YOUR REGISTRATION</h2>
      <p className="font-medium text-center">
        Please fill all the form below!
      </p>

      <div>
        <form className="form-control gap-4 w-[30vw]" onSubmit={handleSubmit}>
          <div className="form-control relative focus-within:border-white">
            <input
              onChange={handleChange}
              type="text"
              name="name"
              id="name"
              placeholder=" "
              className="peer input input-bordered relative z-0 w-full focus:outline-none"
            />
            <label
              htmlFor="email"
              className="label pointer-events-none absolute left-3 top-1 select-none px-1 transition-all duration-300 peer-focus:-translate-y-[21px] peer-focus:text-xs peer-[:not(:placeholder-shown)]:-translate-y-[21px] peer-[:not(:placeholder-shown)]:text-xs"
            >
              <span className="bg-base-100 px-1">Name</span>
            </label>
          </div>
          <div className="form-control relative focus-within:border-white">
            <input
              onChange={handleChange}
              type="text"
              name="username"
              id="username"
              placeholder=" "
              className="peer input input-bordered relative z-0 w-full focus:outline-none"
            />
            <label
              htmlFor="email"
              className="label pointer-events-none absolute left-3 top-1 select-none px-1 transition-all duration-300 peer-focus:-translate-y-[21px] peer-focus:text-xs peer-[:not(:placeholder-shown)]:-translate-y-[21px] peer-[:not(:placeholder-shown)]:text-xs"
            >
              <span className="bg-base-100 px-1">Username</span>
            </label>
          </div>
          <div className="form-control relative focus-within:border-white">
            <input
              onChange={handleChange}
              type="password"
              name="password"
              id="password"
              placeholder=" "
              className="peer input input-bordered relative z-0 w-full focus:outline-none"
            />
            <label
              htmlFor="email"
              className="label pointer-events-none absolute left-3 top-1 select-none px-1 transition-all duration-300 peer-focus:-translate-y-[21px] peer-focus:text-xs peer-[:not(:placeholder-shown)]:-translate-y-[21px] peer-[:not(:placeholder-shown)]:text-xs"
            >
              <span className="bg-base-100 px-1">Password</span>
            </label>
          </div>
          <div className="form-control relative focus-within:border-white">
            <input
              onChange={(e) => {setConfirmPassword(e.target.value)}}
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder=" "
              className="peer input input-bordered relative z-0 w-full focus:outline-none"
            />
            <label
              htmlFor="email"
              className="label pointer-events-none absolute left-3 top-1 select-none px-1 transition-all duration-300 peer-focus:-translate-y-[21px] peer-focus:text-xs peer-[:not(:placeholder-shown)]:-translate-y-[21px] peer-[:not(:placeholder-shown)]:text-xs"
            >
              <span className="bg-base-100 px-1">Confirm Password</span>
            </label>
          </div>
          <div className="form-control mt-4">
            <button
              className="btn btn-success mb-4 text-base-100"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
