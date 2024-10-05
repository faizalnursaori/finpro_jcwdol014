'use client';
import axios from 'axios';
import { getClosestWarehouse } from '@/api/closestWarehouse';
import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';
import { ProductType } from '@/types/product';
import { useParams } from 'next/navigation';

interface Warehouse {
  id: number;
  name: string;
}

interface ProductStock {
  id: number;
  stock: number;
  warehouse: Warehouse;
}

interface Category {
  name: string;
}

interface ProductImage {
  url: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  productStocks: ProductStock[];
  category: Category;
  slug: string;
  productImages: ProductImage[];
}

type Props = {
  catHeader: string;
  slug: string;
  products: Product[];
};

export default function Categories() {
  const [closestWarehouseId, setClosestWarehouseId] = useState<
    number | undefined
  >(1);
  const [products, setProducts] = useState<any>();
  const [error, setError] = useState<string | null>(null);
  const { addToCart, fetchCart, cart } = useCart();
  const router = useRouter();
  const { data } = useSession();
  const params = useParams();

  const getTotalStock = (product: ProductType) => {
    return product.productStocks.reduce(
      (total, stock) => total + stock.stock,
      0,
    );
  };

  const getAvailableStock = (product: ProductType) => {
    const totalStock = getTotalStock(product);
    const cartItem = cart?.items.find((item) => item.product.id === product.id);
    return totalStock - (cartItem?.quantity || 0);
  };

  const handleAddToCart = async (product: ProductType) => {
    if (!data?.user) {
      toast.error('Login Required');
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

  const getWarehouseId = async () => {
    const data = await getClosestWarehouse();
    setClosestWarehouseId(data);
  };

  const getProducts = async (id: number | undefined) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/products/all`,
    );
    console.log('warehouse id', id);
    console.log('total product', res.data);

    const filteredProducts = res.data.filter(
      (item: { productStocks: [{ warehouseId: number }] }) => {
        let result = false;
        item.productStocks.forEach((stock: { warehouseId: number }) => {
          if (stock.warehouseId == id) {
            result = true;
          }
        });
        return result;
      },
    );
    console.log('belom di flter', filteredProducts);

    const filterCategory = filteredProducts.filter(
      (product: { category: { slug: string } }) => {
        return product.category.slug == params.slug;
      },
    );

    console.log('abis di filter', filterCategory);

    setProducts(filterCategory);
    console.log(products);
  };

  useEffect(() => {
    getWarehouseId();
    getProducts(closestWarehouseId);
    fetchCart();
  }, [closestWarehouseId]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4 ml-5">{params.slug}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 ">
        {products?.map((product: any, index: number) => {
          return (
            <div key={index} className="card card-compact max-w-[200px]">
              <div className="card-body">
                <figure className="bg-base-200 rounded-md max-w-[150px] max-h-[150px]">
                  <Image
                    src={`${product.productImages[0]?.url ? product.productImages[0]?.url : ''}`}
                    alt={product.name}
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
                  <button
                    className="btn btn-ghost"
                    onClick={() => handleAddToCart(product)}
                  >
                    <Plus />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
