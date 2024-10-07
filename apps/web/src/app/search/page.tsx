'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { searchProduct } from '@/api/products';
import { Suspense } from 'react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  slug: string;
  productImages: { url: string }[];
  productStocks: { stock: number }[];
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (query) {
        setLoading(true);
        setError(null); // Reset error state
        try {
          const response = await searchProduct(query);
          setResults(response?.data?.products || []);
        } catch (err) {
          setError('Failed to fetch products. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="max-w-[80%] m-auto">
      <Suspense>
        <h2 className="text-xl font-bold mt-5">Search Results for "{query}"</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="flex flex-wrap gap-4 mt-4">
            {results.length > 0 ? (
              results.map((product) => (
                <div key={product.id} className="card card-compact w-60">
                  <div className="card-body">
                    <figure className="bg-base-200 rounded-md">
                      <Image
                        src={
                          product.productImages[0]?.url || '/placeholder.png'
                        }
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
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No results found for "{query}".</p>
            )}
          </div>
        )}
      </Suspense>
    </div>
  );
}
