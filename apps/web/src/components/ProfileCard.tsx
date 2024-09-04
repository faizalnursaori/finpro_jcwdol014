import { SquarePen, BadgeCheck } from "lucide-react";
import Image from "next/image";

export default function ProfileCard() {
  return (
    <div className="card card-compact bg-base-100 shadow-xl w-[40vw] p-5 h-fit">
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-24 rounded-full">
              <Image
                src="/user-avatar.jpg"
                width={150}
                height={150}
                alt="user avatar"
              />
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-xl font-medium">Username</p>
            <BadgeCheck/>
          </div>
        </div>
        <p className="btn btn-ghost hover:btn-link w-fit text-xs">
          <SquarePen size={15}/>
          Edit
        </p>
      </div>

      <div className="flex flex-col gap-5 mt-7">
        <div className="flex justify-between">
          <p className="text-xl">Email:</p>
          <p className="font-medium text-xl">Test@gmail.com</p>
        </div>
        <div className="flex justify-between">
          <p className="text-xl">Referal Code:</p>
          <p className="font-medium text-xl">HRS123</p>
        </div>
      </div>
    </div>
  );
}
