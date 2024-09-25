import { CartItem } from './CartItem';

interface CartItemType {
  id: number;
  product: {
    name: string;
    price: number;
  };
  quantity: number;
}

interface CartTableProps {
  items: CartItemType[];
  onUpdateQuantity: (itemId: number, newQuantity: number) => void;
  onRemoveItem: (itemId: number) => void;
}

const CartTable: React.FC<CartTableProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="text-left py-2 text-xs">PRODUCT</th>
          <th className="text-left py-2 text-xs">PRICE</th>
          <th className="text-left py-2 text-xs">QUANTITY</th>
          <th className="text-left py-2 text-xs">TOTAL</th>
          <th className="text-left py-2 text-xs"></th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
          />
        ))}
      </tbody>
    </table>
  );
};

export default CartTable;
