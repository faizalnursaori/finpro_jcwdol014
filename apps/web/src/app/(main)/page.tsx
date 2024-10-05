'use client';
import axios from 'axios';
import Link from 'next/link';
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
    setClosestWarehouseId(data)
  };

  const getProducts = async (id: number | undefined) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/products/all`,
    );
    console.log('warehouse id', id);
    console.log('total product', res.data);
    
    const filteredProducts = res.data.filter((item:{productStocks:[{warehouseId: number}]}) => {
      let result = false
      item.productStocks.forEach((stock:{warehouseId: number}) => {
        if(stock.warehouseId == id){
          result = true
        }
      })
      return result
    })
    console.log(filteredProducts);
    
    setProducts(filteredProducts);
    console.log(products);
    
    
  };

  useEffect(() => {
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
            <button className="btn btn-primary"><Link href='/products'>Start Shopping!</Link></button>
          </div>
        </div>
      </div>
      <section>
        <ListCategories />
      </section>
      <section>
        <LandingProducts catHeader={'New Products'} products={products} slug='new' />
        <LandingProducts catHeader={'Instant Food'} products={products} slug={'instant'} />
        <LandingProducts catHeader={'Beras'} products={products} slug={'beras'} />
        <LandingProducts catHeader={'Daging Ayam'} products={products} slug={'daging-ayam'} />
      </section>
    </main>
  );
}
