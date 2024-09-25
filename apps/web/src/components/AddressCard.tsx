import { Trash2, SquarePen } from 'lucide-react';
import Link from 'next/link';


export default function AddressCard({ address, handleDelete }: any) {
  return (
    <div className="card bg-base-100 shadow-xl w-80 max-w-80  card-compact max-h-60 h-60">
      <div className="card-body">
        <h2 className="card-title text-md font-medium">{address.name}</h2>
        <p className="text-sm">{address.address}</p>
        <p className="text-sm">
          {address.city.name}, {address.province.name}
        </p>
        <p className="text-sm">{address.postalCode}</p>
        <div className="divider"></div>
        <div className="flex justify-between items-center w-full">
          <div className="flex justify-center items-center gap-2">
            <Link href={`/profile/addresses/edit/${address.id}`}>
              <SquarePen />
            </Link>
            <button
              className=""
              onClick={() => handleDelete(address.id)}
            >
              <Trash2/>
            </button>
            <dialog id="my_modal_1" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Are you sure tou want to delete this address?</h3>
                <p className="py-4">
                  It will delete all the data permanently
                </p>
                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn btn-error" onClick={() => handleDelete(address.id)}>Delete</button>
                    <button className="btn btn-ghost" onClick={(e) => {e.preventDefault()}}>Cancel</button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
          {address.isPrimary ? (
            <p className="bg-green-800 text-base-100 font-medium max-w-fit p-1">
              Default
            </p>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
}