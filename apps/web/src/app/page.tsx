'use client';
import axios from 'axios';
import { getUserCurrentLocation } from '@/utils/getUserCurrentLocation';
import { getClosestWarehouse } from '@/api/warehouse';
import ListCategories from '@/components/ListCategories';
import LandingProducts from '@/components/LandingProducts';
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

export default function Home() {
  const [userLoc, setUserLoc] = useState<{ lon: number; lat: number }>();
  const [closestWarehouseId, setClosestWarehouseId] = useState<number>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, fetchCart, cart } = useCart();
  const base_api = 'http://localhost:8000/api'
  const router = useRouter();

  const getWarehouseId = async () => {
    const data = await getClosestWarehouse();
    setClosestWarehouseId(data);
  };

  const getProducts  = async (id: number | undefined) =>{
    const productData: any = []
    const res = await axios.get(`${base_api}/products`)

    console.log(res.data);
    
    const filteredProducts = res.data.filter((item:{productStocks:[{warehouseId: number}]}) => {
      let result = false
      item.productStocks.forEach((stock:{warehouseId: number}) => {
        if(stock.warehouseId == id){
          result = true
        }
      })
      return result
    })

    setProducts(filteredProducts);
    
    
  } 

  useEffect(() => {
    //getting user's lat and long
    setUserLoc(getUserCurrentLocation());
    getWarehouseId();
    getProducts(closestWarehouseId)
    fetchCart();
  }, [closestWarehouseId]);

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
  
  return (
    <main>
      <div className="hero max-w-[80%] bg-pinky m-auto p-5 rounded-lg">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="">
            <p className="text-xs font-bold">Welcome to Hemart</p>
            <h1 className="text-3xl font-bold">
              Your One-Stop Shop for Fresh & Affordable Groceries
            </h1>
            <p className="py-6">
              At Hemart, we believe that everyone deserves access to fresh,
              high-quality groceries at prices that wont break the bank. Explore
              our wide selection of fresh produce, pantry staples, and household
              essentials. Shop smart, live healthy—only at Hemart.
            </p>
            <button className="btn btn-primary">Start Shopping!</button>
          </div>
        </div>
      </div>
      <section>
        <ListCategories />
      </section>
      <section>
        <LandingProducts catHeader = {'New Products'} products={products}/>
        <LandingProducts  catHeader={'Instant Food'} products={products}/>
        <LandingProducts catHeader={'Beverages'} products={products}/>
      </section>
    </main>
  );
}
