'use client';
import { SquarePen, BadgeCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { verifyUser } from '@/api/user';
import { useRouter, redirect } from 'next/navigation';
import { useState } from 'react';
import { editUser } from '@/api/user';

export default function ProfileCard() {
  const { data, update } = useSession();
  const [Userdata, setData] = useState<any>({
    dob: data?.user?.dob,
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...Userdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      Object.entries(Userdata).forEach(([key, value]) => {
        formData.append(key, value as any);
      });

      await editUser(data?.user?.id as string, formData);
      await update({
        username: data?.user?.username,
        email: data?.user?.email,
        isVerified: data?.user.isVerified,
        name: data?.user?.name,
        mobileNumber: data?.user.mobileNumber,
        gender: data?.user?.gender,
        dob: Userdata.dob,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleVerify = async () => {
    const email = { email: data?.user?.email };
    const res = await verifyUser(email);
    router.push('/profile/info/verify');
  };

  
  return (
    <div className="card card-compact bg-base-100 shadow-xl sm:w-[40vw] w-[100vw] p-5 h-fit">
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-24 rounded-full">
              <Image
                src={`${data?.user?.image}`}
                width={150}
                height={150}
                alt="user avatar"
              />
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-xl font-medium">{data?.user?.username}</p>
            {data?.user?.isVerified ? <BadgeCheck /> : ''}
          </div>
        </div>
        <Link
          href="/profile/edit"
          className="btn btn-ghost hover:btn-link w-fit text-xs"
        >
          <SquarePen size={15} />
          Edit
        </Link>
      </div>

      <div className="flex flex-col gap-5 mt-7 ">
        <div className="flex justify-between items-center">
          <p className="text-xl">Name:</p>
          <p className="font-medium text-xl">{data?.user?.name}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xl">Email:</p>
          <p className="font-medium text-xl">{data?.user?.email}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xl">Gender:</p>
          <p className="font-medium text-xl">
            {data?.user?.gender ? data?.user?.gender : '-'}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xl">Phone Number:</p>
          <p className="font-medium text-xl">
            {data?.user?.mobileNumber ? data?.user?.mobileNumber : '-'}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xl">Date of Birth:</p>
          {data?.user?.dob ? (
            <p className="font-medium text-xl">
              {new Date(data?.user?.dob).toLocaleDateString()}
            </p>
          ) : (
            <>
              <button
                className="btn btn-link"
                onClick={() =>
                  document?.getElementById('my_modal_1')?.showModal()
                }
              >
                Set Date
              </button>
              <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                  <h3 className="font-bold text-lg">Set your Date of Birth</h3>
                  <p className="py-4">
                    Please note that you can only change your date of birth
                    once!
                  </p>
                  <div className="modal-action">
                    <form
                      className="flex items-center justify-center m-auto"
                      method="dialog"
                      onSubmit={handleSubmit}
                    >
                      <div className="flex flex-col justify-center items-center gap-2">
                        <div className="form-control relative focus-within:border-white">
                          <input
                            onChange={handleChange}
                            type="date"
                            name="dob"
                            id="dob"
                            className="peer input input-bordered relative z-0 w-full focus:outline-none"
                          />
                          <label
                            htmlFor="dob"
                            className="label pointer-events-none absolute left-3 top-1 select-none px-1 transition-all duration-300 -translate-y-[21px] text-xs peer-[:not(:placeholder-shown)]:-translate-y-[21px] peer-[:not(:placeholder-shown)]:text-xs"
                          >
                            <span className="bg-base-100 px-1">
                              Date of Birth
                            </span>
                          </label>
                        </div>
                        <button className="btn w-fit btn-outline btn-success">
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </dialog>
            </>
          )}
        </div>
        <div className="flex justify-between items-center">
          {data?.user?.isVerified ? (
            ''
          ) : (
            <>
              <p className="text-xl">You are not yet verified</p>
              <button
                className="btn btn-link p-0"
                onClick={() => handleVerify()}
              >
                Verify
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
