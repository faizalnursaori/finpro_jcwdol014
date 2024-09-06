import { UserTable } from '@/components/User/UserTable';

export default function UserManagement() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <h2 className="text-xl my-4">End-User Management</h2>
      </div>
      <div className="bg-white">
        <UserTable />
      </div>
    </div>
  );
}
