import { OrderTable } from '@/components/Admin/OrderTable';

export default function OrderManagement() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <h2 className="text-xl my-4">Order Management</h2>
      </div>
      <div className="bg-white">
        <OrderTable />
      </div>
    </div>
  );
}
