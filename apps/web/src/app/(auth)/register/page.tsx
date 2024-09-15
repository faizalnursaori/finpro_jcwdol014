'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/ApiClient';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { FaGoogle, FaGithub, FaCheckCircle } from "react-icons/fa";


export default function Register() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await registerUser(email);
      router.push('/register/confirm-info');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="bg-base-100 flex flex-col justify-center items-center gap-6">
      <h2 className="font-bold text-2xl">CREATE ACCOUNT</h2>
      <p className="font-medium text-center">
        Create your free Hemart account today— it only takes less than a minute!
      </p>
      <ul className="flex flex-col gap-2">
        <li className="flex gap-2 items-center"><FaCheckCircle/>Faster ordering for your repeat purchases</li>
        <li className="flex gap-2 items-center"><FaCheckCircle/>Access to exclusive offers</li>
        <li className="flex gap-2 items-center"><FaCheckCircle/>Create convenient shopping list</li>
        <li className="flex gap-2 items-center"><FaCheckCircle/>Effortless order & address management</li>
      </ul>

      <div>
        <form className="form-control gap-4" onSubmit={handleSubmit}>
          <div className="form-control relative focus-within:border-white">
            <input
              onChange={(e) => setEmail(e.target.value)}
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
              <span className="bg-base-100 px-1">Email</span>
            </label>
          </div>
          <div className="form-control mt-4">
            <button className="btn btn-success mb-4 text-base-100" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Register"}
            </button>
            <p className="text-center">
              Already have an account?{" "}
              <Link
                href={"/login"}
                className="font-semibold text-indigo-500 hover:underline"
              >
                Log In
              </Link>
            </p>
            <div className="divider">Login with Socials</div>
            <div className='flex gap-5 items-center justify-center my-2'>
              <button onClick={() => signIn('google',{callbackUrl: '/'})}><FaGoogle size={25}/></button>
              <button onClick={() => signIn('github',{callbackUrl: '/'})}><FaGithub size={25}/></button>
            </div>
            <div className="mt-4 flex w-80 flex-col items-center justify-center gap-8">
              <Link
                className="relative inline-flex items-center justify-center text-sm no-underline outline-none transition-opacity hover:opacity-80 active:opacity-60"
                href="/"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
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
                <span className="flex items-center">Back to Home page</span>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
