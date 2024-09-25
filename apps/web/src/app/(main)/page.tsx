'use client';
import axios from 'axios';
// import { getUserCurrentLocation } from '@/utils/getUserCurrentLocation';
import { getClosestWarehouse } from '@/api/closestWarehouse';
import ListCategories from '@/components/ListCategories';
import LandingProducts from '@/components/LandingProducts';
import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { ProductType } from '@/types/product';
import 'dotenv/config';

export default function Home() {
  const [userLoc, setUserLoc] = useState<{ lon: number; lat: number }>();
  const [closestWarehouseId, setClosestWarehouseId] = useState<
    number | undefined
  >(1);
  const [products, setProducts] = useState<ProductType[]>([]);
  const { addToCart, fetchCart, cart } = useCart();

  const getWarehouseId = async () => {
    const data = await getClosestWarehouse();
    if (data !== null) {
      setClosestWarehouseId(data);
    } else {
      setClosestWarehouseId(1);
    }
  };

  const getProducts = async (id: number | undefined) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/products/`,
    );

    const filteredProducts = res.data.products.filter((item: ProductType) =>
      item.productStocks.some((stock) => stock.warehouse.id === id),
    );
    setProducts(filteredProducts);
  };

  const success = (res: any) => {
    
    setUserLoc({lon:res.coords.longitude, lat:res.coords.latitude })
  };

  const fail = (res: any) => {
    console.log(res);
  };


  // navigator.geolocation.getCurrentPosition(success, fail)

  useEffect(() => {
    // setUserLoc(getUserCurrentLocation());
    navigator.geolocation.getCurrentPosition(success, fail)
    getWarehouseId();
    getProducts(closestWarehouseId);
    fetchCart();
  }, [closestWarehouseId]);

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
        <LandingProducts catHeader={'New Products'} products={products} />
        <LandingProducts catHeader={'Instant Food'} products={products} />
        <LandingProducts catHeader={'Beverages'} products={products} />
      </section>
    </main>
  );
}
