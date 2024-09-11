'use client'
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useEffect } from "react"

export default function infoConfirmation(){
  const {update} = useSession()


  useEffect(()=>{
    update({isVerified: true})
  },[])


    return(
        <div className="bg-base-100 flex flex-col justify-center items-center gap-6">
            <h2 className="font-bold text-2xl">Thank you for verifying yourself!</h2>
            <p className="font-medium text-center">Now you can access all of our feature!</p>
            <div className="mt-4 flex w-80 flex-col items-center justify-center gap-8">
              <Link
                className="relative inline-flex items-center justify-center text-sm no-underline outline-none transition-opacity hover:opacity-80 active:opacity-60"
                href="/profile"
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
                <span className="flex items-center">Back to Profile</span>
              </Link>
            </div>
        </div>
    )
}