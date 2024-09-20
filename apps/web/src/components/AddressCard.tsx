import { Trash2, SquarePen } from 'lucide-react';
import Link from 'next/link';
import { deleteUserAddresses } from '@/api/address';
import { useState } from 'react';


export default function AddressCard({ address,id }: any) {
  const [selectedId, setSelectedId] = useState(id)

    
  const handleDelete = async () => {
    await deleteUserAddresses(selectedId);
  };


  return (
    <div className="card bg-base-100 shadow-xl max-w-[100%] card-compact h-fit">
      <div className="card-body" onClick={() => {setSelectedId(id);
      }}>
        <h2 className="card-title text-md font-medium">{address.name}</h2>
        <p className="text-sm">{address.address}</p>
        <p className='text-sm'>
          {address.city.name}, {address.province.name}
        </p>
        <p className='text-sm'>{address.postalCode}</p>
        <div className="divider"></div>
        <div className="flex justify-between items-center w-full">
          <div className="flex justify-center items-center gap-2">
            <Link href={`/profile/addresses/edit/${address.id}`}>
              <SquarePen />
            </Link>
            <button
              className=""
              onClick={handleDelete}
            >
              <Trash2/>
            </button>
          </div>
          {address.isPrimary? <p className="bg-green-800 text-base-100 font-medium max-w-fit p-1">Default</p> : ''}
        </div>
      </div>
    </div>
  );
}
