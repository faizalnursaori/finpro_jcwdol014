'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaGoogle, FaGithub } from "react-icons/fa";
import { signIn } from 'next-auth/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const data = await signIn('credentials', {redirect: true, email, password})
      
    } catch (err) {
      console.error('Login error:', err); // Log the full error
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred',
      );
    }
  };

  return (
    <div className="bg-base-100 flex flex-col justify-center items-center gap-6">
      <h2 className="font-bold text-2xl">ACCOUNT LOGIN</h2>
      <p className="font-medium text-center">
        Login to create shopping list, access exclusive offers & manage you
        orders.
      </p>

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
          <div className="form-control relative focus-within:border-white">
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              name="password"
              id="password"
              placeholder=" "
              className="peer input input-bordered relative z-0 w-full pr-10 focus:outline-none"
            />
            <label
              htmlFor="password"
              className="label pointer-events-none absolute left-3 top-1 select-none px-1 transition-all duration-300 peer-focus:-translate-y-[21px] peer-focus:text-xs peer-[:not(:placeholder-shown)]:-translate-y-[21px] peer-[:not(:placeholder-shown)]:text-xs"
            >
              <span className="bg-base-100 px-1">Password</span>
              
            </label> 
            <label className="label">
              <span className="label-text-alt hover:underline hover:text-success"><Link href='/login/forget-password'>Forget your password?</Link></span>
            </label>
          </div>
          <div className="form-control mt-6">
            <button className="btn btn-success mb-4 text-base-100" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
            <p className="text-center">
              Dont have an account?{" "}
              <Link
                href={"/register"}
                className="font-semibold text-indigo-500 hover:underline"
              >
                Sign Up
              </Link>
            </p>
            <div className="divider">Login with Socials</div>
            <div className='flex gap-5 items-center justify-center my-2'>
              <button type='button' onClick={() => signIn("google")}><FaGoogle size={25}/></button>
              <button type='button' onClick={() => signIn("github")}><FaGithub size={25}/></button>
              
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
