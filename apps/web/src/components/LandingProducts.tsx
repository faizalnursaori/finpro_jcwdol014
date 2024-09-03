'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useEffect,useState } from 'react';
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

type Props = {
  catHeader: string;
  products: [] ;
};

export default function LandingProducts({ catHeader, products }: Props) {
  const [error, setError] = useState<string | null>(null);
  const { addToCart, fetchCart, cart } = useCart();
  const router = useRouter();

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


  useEffect(() => {}, [products]);

  const filteredProducts = catHeader === 'New Products' ? products : products?.filter((product:{category:{name:string}}) => {
    return product.category.name == catHeader
  })

  return (
    <>
      <div className="max-w-[80%] m-auto">
        <div className="flex justify-between mt-5 items-center">
          <h2 className="text-xl font-bold ">{catHeader}</h2>
          <button className="btn btn-ghost hover:btn-link">View All</button>
        </div>
        <div className="flex gap-3 overflow-x-auto">
          {filteredProducts?.map(
            (
              product: {
                slug: string;
                name: string;
                price: number;
                description: string;
                productImages: [{ url: string }];
              },
              index: number,
            ) => {
              return (
                <div key={index} className="card card-compact max-w-[200px]">
                  <div className="card-body">
                    <figure className="bg-base-200 rounded-md max-w-[150px] max-h-[150px]">
                      <Image
                        src={`/${product.productImages[0].url}.jpeg`}
                        alt="Mie"
                        width={150}
                        height={150}
                        className="max-w-[150px] max-h-[150px]"
                      />
                    </figure>
                    <Link
                      href={`/products/${product.slug}`}
                      className="card-title hover:underline hover:text-success duration-500"
                    >
                      {product.name}
                    </Link>
                    <p className="hover:underline">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-success">{`Rp ${product.price.toLocaleString('id-ID')}`}</p>
                      <button className="btn btn-ghost" onClick={() => handleAddToCart(product)}>
                        <Plus />
                      </button>
                    </div>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>
    </>
  );
}
