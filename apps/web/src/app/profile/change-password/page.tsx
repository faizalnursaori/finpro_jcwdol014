'use client'
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { editUserPassword } from "@/api/user";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


export default function ChangePasswordCard() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [newData, setNewData] = useState({})
    const router = useRouter()
    const {data} = useSession()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewData({ ...newData, [e.target.name]: e.target.value });
      setPassword(e.target.value)
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
      e.preventDefault()
      if(!password || password.length < 3){
        toast.error('Passwrod must be at least 3 characters.')
        return
      }
      try {
        setIsLoading(true)
      if(password !== confirmPassword) {
        toast.error('Password unmatched!')
        setIsLoading(false)
        return
      }

      await editUserPassword(data?.user?.id as string, newData)
      setIsLoading(false)
      toast.success('Password changed')
      router.push('/profile')
      } catch (error) {
        console.log(error);
        toast.error('Failed Updating Password.')
        setIsLoading(false)
        
      }
 
    }

  return (
    <>
    <Toaster/>
    <div className="card card-compact bg-base-100 shadow-xl h-fit sm:w-[40vw] w-[100vw] p-5">
      <div>
        <form className="form-control gap-4" onSubmit={handleSubmit}>
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
