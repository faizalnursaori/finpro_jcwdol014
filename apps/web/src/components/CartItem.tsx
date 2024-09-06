import React from 'react';
import { Trash2 } from 'lucide-react';
import { formatRupiah } from '@/utils/currencyUtils';

interface CartItemType {
  id: number;
  product: {
    name: string;
    price: number;
  };
  quantity: number;
}

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: number, newQuantity: number) => void;
  onRemoveItem: (itemId: number) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  return (
    <tr className="border-b">
      <td className="py-4">
        <div className="flex items-center">
          <span>{item.product.name}</span>
        </div>
      </td>
      <td className="py-4">{formatRupiah(item.product.price)}</td>
      <td className="py-4">
        <div className="flex items-center">
          <button
            onClick={() =>
              onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
            }
            className="px-[11px] py-1 bg-gray-200 rounded-full"
          >
            -
          </button>
          <span className="mx-2">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="px-[10px] py-1 bg-gray-200 rounded-full"
          >
            +
          </button>
        </div>
      </td>
      <td className="py-4">
        {formatRupiah(item.product.price * item.quantity)}
      </td>
      <td className="py-4">
        <button onClick={() => onRemoveItem(item.id)} className="text-red-500">
          <Trash2 size={20} />
        </button>
      </td>
    </tr>
  );
};
