'use client';
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { editUser } from '@/api/user';
import { useSession } from 'next-auth/react';
import { User } from 'lucide-react';

export default function Edit() {
  const {data, update} = useSession()
  const [image, setImage] = useState<File | null>(null)
  const [Userdata, setData] = useState<{username: string, email: any, image: any, isVerified: any}>({username: data?.user?.username , email: data?.user?.email, image: data?.user?.image, isVerified: data?.user?.isVerified});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...Userdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {

      if(Userdata.email != data?.user?.email) Userdata.isVerified = false

      await editUser(data?.user?.id, {...Userdata, image});
      update({username: Userdata.username, email: Userdata.email, isVerified: Userdata.isVerified})
      toast.success('Profile Updated!');
      router.push('/profile');
    } catch (error) {
      console.log(error);
    }
  };


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
                onChange={handleImage}
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
