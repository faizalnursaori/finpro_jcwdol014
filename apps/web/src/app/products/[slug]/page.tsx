'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getProductBySlug } from '@/api/products';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import { ProductType } from '@/types/product';
import { useSession } from 'next-auth/react';
import { getClosestWarehouse } from '@/api/warehouse';
import { getUserCurrentLocation } from '@/utils/getUserCurrentLocation';

interface Warehouse {
  id: number;
  name: string;
}

interface ProductStock {
  id: number;
  stock: number;
  warehouse: Warehouse;
}

const ProductDetail = () => {
  const { slug } = useParams();
  const { data } = useSession();

  const { addToCart, fetchCart, cart } = useCart();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userLoc, setUserLoc] = useState<{ lon: number; lat: number }>();
  const [closestWarehouseId, setClosestWarehouseId] = useState<number>(1);

  const getWarehouseId = async () => {
    const data = await getClosestWarehouse();
    setClosestWarehouseId(data);
  };

  useEffect(() => {
    setUserLoc(getUserCurrentLocation());
    getWarehouseId();
    if (slug) {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const res = await getProductBySlug(slug as string);
          if (!res.ok) {
            throw new Error('Failed to fetch product');
          }

          const filteredProductStock = res.data.product.productStocks.find(
            (stock: ProductStock) => stock.warehouse.id === closestWarehouseId,
          );

          setProduct({
            ...res.data.product,
            productStocks: [filteredProductStock],
          });
        } catch (error) {
          setError((error as Error).message);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [slug, closestWarehouseId]);

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

  const handleAddToCart = async () => {
    if (!product) return;

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
      const res = await addToCart(product.id, quantity, availableStock);
      setSuccess('Product added to cart successfully!');
    } catch (error) {
      setError((error as Error).message);
    }
  };

  if (loading) return <span className="loading loading-bars loading-lg"></span>;

  const stockAvailable = product?.productStocks[0]?.stock > 0 || null;

  return (
    <div className="container mx-auto p-5">
      <Toaster />
      {product ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {product.productImages && product.productImages.length > 0 && (
            <div className="carousel w-full max-w-4xl mx-auto overflow-x-auto snap-x snap-mandatory">
              <div className="flex space-x-4">
                {product.productImages.map((image: any, index: number) => (
                  <div
                    key={index}
                    className="w-full h-96 flex-shrink-0 snap-center"
                  >
                    <Image
                      src={image.url}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-contain rounded-lg"
                      height={500}
                      width={500}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-700 text-lg mt-4">{product.description}</p>
            <p className="text-2xl font-semibold mt-4">{`Rp ${product.price.toLocaleString('id-ID')}`}</p>

            <div className="mt-6">
              <label className="block mb-2 text-sm font-medium">Quantity</label>
              <input
                type="number"
                className="input input-bordered w-full max-w-xs"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                disabled={!stockAvailable}
              />
            </div>

            <div className="mt-6">
              <button
                className="btn btn-primary w-full"
                onClick={handleAddToCart}
                disabled={!stockAvailable} // Disable if no stock
              >
                {stockAvailable ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>

            {success && (
              <div className="alert alert-success mt-4">{success}</div>
            )}
          </div>
        </div>
      ) : (
        <p>No product found.</p>
      )}
    </div>
  );
};

export default ProductDetail;
