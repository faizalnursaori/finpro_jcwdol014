'use client'
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function infoConfirmation(){
  const {data, update} = useSession()
  const [Userdata, setData] = useState<any>({username: data?.user?.username,
    email: data?.user?.email,
    isVerified: "true",
    image: data?.user?.image,
    name: data?.user?.name,
    mobileNumber: data?.user?.mobileNumber,
    gender: data?.user?.gender});

  
  const router = useRouter()

  const handleClick = async () => {
    try {
      await update({
        username: Userdata.username,
        email: Userdata.email,
        isVerified: true,
        name: Userdata.name,
        mobileNumber: Userdata.mobileNumber,
        gender: Userdata.gender
      });
      
    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(() =>{
    handleClick()
  },[])

    return(
        <div className="bg-base-100 flex flex-col justify-center items-center gap-6">
            <h2 className="font-bold text-2xl">Thank you for verifying yourself!</h2>
            <p className="font-medium text-center">You now can access all of our features.</p>
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
    )
}