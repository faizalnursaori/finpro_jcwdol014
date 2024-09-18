import { Trash2, SquarePen } from 'lucide-react';
import Link from 'next/link';
import { deleteUserAddresses } from '@/api/address';

export default function AddressCard({ address, id }: any) {

    
  const handleDelete = async (id:any) => {
    await deleteUserAddresses(id);
  };

  return (
    <div className="card bg-base-100 shadow-xl max-w-[100%] card-compact h-fit">
      <div className="card-body">
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
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <button
              className=""
              onClick={() => document.getElementById('my_modal_2').showModal()}
            >
              <Trash2/>
            </button>
            <dialog id="my_modal_2" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Delete Address</h3>
                <p className="py-4">Are you sure you want to delete this address?</p>
                <form method="dialog" className="modal-backdrop flex gap-4">
                <button className='btn btn-outline btn-error' onClick={() => handleDelete(address.id)}>Delete</button>
                <button className='btn btn-success'>Cancel</button>
              </form>
              </div>
              
            </dialog>
          </div>
          {address.isPrimary? <p className="bg-green-800 text-base-100 font-medium max-w-fit p-1">Default</p> : ''}
        </div>
      </div>
    </div>
  );
}
