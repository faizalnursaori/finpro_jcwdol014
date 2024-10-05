'use client';
import axios from 'axios';
import { getCategories } from '@/api/category';
import LandingProducts from '@/components/LandingProducts';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { getClosestWarehouse } from '@/api/closestWarehouse';

export default function Products() {
  const [closestWarehouseId, setClosestWarehouseId] = useState<
    number | undefined
  >();
  const [products, setProducts] = useState<any>();
  const [categories, setCategories] = useState<any>();
  const { addToCart, fetchCart, cart } = useCart();

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
    console.log(filteredProducts);

    setProducts(filteredProducts);
    console.log(products);
  };

  const getCategoriesData = async () => {
    const res = await getCategories();
    console.log(res.data);
    
    setCategories(res.data);
  };

  useEffect(() => {
    getCategoriesData();
    getWarehouseId();
    getProducts(closestWarehouseId);
  }, [closestWarehouseId]);
   console.log(categories);
   
  return <div>{categories?.map((category:any, index:number) =>{
    return <LandingProducts catHeader={category.name} products={products} slug={category.slug}/>
  })}</div>;
}
