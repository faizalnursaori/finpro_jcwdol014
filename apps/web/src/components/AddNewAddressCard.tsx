import { MapPinPlus } from 'lucide-react';
import Link from 'next/link';

export default function AddNewAddressCard() {
  return (
    <Link href='/profile/addresses/new'>
      <div className="card bg-base-100 shadow-xl w80 max-w-80  h-60 ">
        <div className="card-body flex items-center flex-col justify-center h-full">
          <h2 className="card-title">
            <MapPinPlus />
          </h2>
          <p className='font-medium'>Add New Address</p>
        </div>
      </div>
    </Link>
  );
}
