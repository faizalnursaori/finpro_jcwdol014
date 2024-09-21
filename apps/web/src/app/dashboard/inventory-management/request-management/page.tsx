import { RequestStock } from '@/components/Inventory/ButtonRequestStock';
import StockTransferTable from '@/components/Inventory/StockTransferTable';

export default function RequestManagement() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <h2 className="text-xl my-4">Request Inventory Management</h2>
      </div>
      <RequestStock />
      <div className="bg-white">
        <StockTransferTable />
      </div>
    </div>
  );
}
