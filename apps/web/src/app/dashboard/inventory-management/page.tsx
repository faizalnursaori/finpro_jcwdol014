import InventoryTable from '@/components/Inventory/InventoryTable';

export default function InventoryManagement() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <h2 className="text-xl my-4">Inventory Management</h2>
      </div>
      <div className="bg-white">
        <InventoryTable />
      </div>
    </div>
  );
}
