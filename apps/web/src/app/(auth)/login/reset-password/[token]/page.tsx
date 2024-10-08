'use client'
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { resetUserPassword } from "@/api/user";
import { useRouter, useParams } from "next/navigation";


export default function ChangePasswordCard() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const params = useParams()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
      e.preventDefault()
      setIsLoading(true)
      
      if(password !== confirmPassword) {
        toast.error('Password unmatched!')
        setIsLoading(false)
        return
      }

      try {
        await resetUserPassword(params.token, {password})
        toast.success('Password changed')
        setIsLoading(false)
        router.push('/login')
      } catch (error) {
        console.log(error);
        
      }

      
    }

  return (
    <>
    <Toaster/>
    <div className="bg-base-100 flex flex-col justify-center items-center gap-6">
      <h2 className="font-bold text-2xl">Please enter your new password</h2>
      <div>
        <form className="form-control gap-4" onSubmit={handleSubmit}>
          <div className="form-control relative focus-within:border-white">
            <input
              onChange={(e) => {setPassword(e.target.value)}}
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
              onChange={(e) => setConfirmPassword(e.target.value)}
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
    </>
  );
}
