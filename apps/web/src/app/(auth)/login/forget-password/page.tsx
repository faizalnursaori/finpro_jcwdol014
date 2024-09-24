"use client";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import toast, {Toaster} from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Register() {
  const base_api = "http://localhost:8000";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if(!email || email.length < 5){
      toast.error('Invalid Email')
      return
    }
    try {
      const res = await axios.post(`${base_api}/api/auth/user/reset-password`, {
        email,
      });
      
      toast.success(res.data.message);
      router.push("/login/confirm-info");
    } catch (error) {
      console.error(error);
      toast.error("Request failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Toaster/>
    <div className="bg-base-100 flex flex-col justify-center items-center gap-6">
      <h2 className="font-bold text-2xl">RESET YOUR PASSWORD</h2>
      <p className="font-medium text-center">
        Forget your password? We will help you reset your password by sending a confirmation email.
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
          <div className="form-control mt-4">
            <button className="btn btn-success mb-4 text-base-100" disabled={isLoading}>
              {isLoading ? "Submiting" : "Submit"}
            </button>
          
            <div className="mt-4 flex w-80 flex-col items-center justify-center gap-8">
              <Link
                className="relative inline-flex items-center justify-center text-sm no-underline outline-none transition-opacity hover:opacity-80 active:opacity-60"
                href="/login"
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
                <span className="flex items-center">Back to Login page</span>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
