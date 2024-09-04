'use client'
import { useState } from "react";

export default function ChangePasswordCard() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)



    const handleSubmit = async () =>{

    }

  return (
    <div className="card card-compact bg-base-100 shadow-xl h-fit w-[40vw] p-5">
      <div>
        <form className="form-control gap-4" onSubmit={handleSubmit}>
          <div className="form-control relative focus-within:border-white">
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              name="password"
              id="password"
              placeholder=" "
              className="peer input input-bordered relative z-0 w-full focus:outline-none"
            />
            <label
              htmlFor="password"
              className="label pointer-events-none absolute left-3 top-1 select-none px-1 transition-all duration-300 peer-focus:-translate-y-[21px] peer-focus:text-xs peer-[:not(:placeholder-shown)]:-translate-y-[21px] peer-[:not(:placeholder-shown)]:text-xs"
            >
              <span className="bg-base-100 px-1">New Password</span>
            </label>
          </div>
          <div className="form-control relative focus-within:border-white">
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              name="Confirmpassword"
              id="Confirmpassword"
              placeholder=" "
              className="peer input input-bordered relative z-0 w-full focus:outline-none"
            />
            <label
              htmlFor="password"
              className="label pointer-events-none absolute left-3 top-1 select-none px-1 transition-all duration-300 peer-focus:-translate-y-[21px] peer-focus:text-xs peer-[:not(:placeholder-shown)]:-translate-y-[21px] peer-[:not(:placeholder-shown)]:text-xs"
            >
              <span className="bg-base-100 px-1">Confirm New Password</span>
            </label>
          </div>
          <div className="form-control mt-4">
            <button className="btn btn-success mb-4 text-base-100" disabled={isLoading}>
              {isLoading ? "Submiting" : "Submit"}
            </button>

            <div className="mt-4 flex w-80 flex-col items-center justify-center gap-8">
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
