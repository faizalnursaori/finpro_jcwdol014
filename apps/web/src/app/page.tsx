'use client';

import { useState, useEffect } from 'react';
// import { useCart } from '@/lib/CartContext';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';

interface Warehouse {
  id: number;
  name: string;
}

interface ProductStock {
  id: number;
  stock: number;
  warehouse: Warehouse;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  productStocks: ProductStock[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, fetchCart, cart } = useCart();

  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchCart(); // Fetch the current cart
  }, []);

  const getTotalStock = (product: Product) => {
    return product.productStocks.reduce(
      (total, stock) => total + stock.stock,
      0,
    );
  };

  const getAvailableStock = (product: Product) => {
    const totalStock = getTotalStock(product);
    const cartItem = cart?.items.find((item) => item.product.id === product.id);
    return totalStock - (cartItem?.quantity || 0);
  };

  const handleAddToCart = async (product: Product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Jika tidak ada token, arahkan ke halaman login
      router.push('/login');
      return;
    }

    const availableStock = getAvailableStock(product);
    if (availableStock <= 0) {
      setError('This product is out of stock');
      return;
    }

    try {
      await addToCart(product.id, 1, availableStock);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to add product to cart');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => {
          const availableStock = getAvailableStock(product);
          return (
            <li key={product.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600">{product.description}</p>
              <p className="mt-2">Price: ${product.price.toFixed(2)}</p>
              <p className="mt-1">Available Stock: {availableStock}</p>
              <button
                onClick={() => handleAddToCart(product)}
                disabled={availableStock <= 0}
                className={`mt-2 px-4 py-2 rounded ${
                  availableStock > 0
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {availableStock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
