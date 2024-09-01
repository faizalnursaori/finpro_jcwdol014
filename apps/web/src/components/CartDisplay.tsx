// CartDisplay.tsx
import Link from 'next/link';

// Definisikan interface untuk Product, CartItem, dan Cart
interface Product {
  id: number;
  name: string;
  price: number;
}

interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
}

interface CartDisplayProps {
  cart: Cart;
}

const CartDisplay = ({ cart }: CartDisplayProps) => {
  const totalPrice = cart.items.reduce(
    (total: number, item: CartItem) =>
      total + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="mb-8 p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-2">
        Cart #{cart.id} (User ID: {cart.userId})
      </h2>
      {cart.items.length === 0 ? (
        <p>This cart is empty.</p>
      ) : (
        <>
          <ul>
            {cart.items.map((item: CartItem) => (
              <li
                key={item.id}
                className="flex justify-between items-center border-b py-2"
              >
                <div>
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p>${item.product.price.toFixed(2)}</p>
                </div>
                <div>
                  <span className="mx-2">Quantity: {item.quantity}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <p className="font-bold">Total: ${totalPrice.toFixed(2)}</p>
          </div>
          <Link
            href={`/checkout/${cart.id}`}
            className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
          >
            Proceed to Checkout
          </Link>
        </>
      )}
    </div>
  );
};

export default CartDisplay;
