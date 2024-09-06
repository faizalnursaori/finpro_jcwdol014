import { AdminTable } from '@/components/Admin/AdminTable';

export default function AdminManagement() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <h2 className="text-xl my-4">Admin Management</h2>
      </div>
      <div className="bg-white">
        <AdminTable />
      </div>
    </div>
  );
}
