'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';

type Props = {
  catHeader: string;
  products: [] | undefined;
};

export default function LandingProducts({ catHeader, products }: Props) {
  useEffect(() => {}, [products]);

  return (
    <>
      <div className="max-w-[80%] m-auto">
        <div className="flex justify-between mt-5 items-center">
          <h2 className="text-xl font-bold ">{catHeader}</h2>
          <button className="btn btn-ghost hover:btn-link">View All</button>
        </div>
        <div className="flex gap-3 overflow-x-auto">
          {products?.map(
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
                <div key={index} className="card card-compact ">
                  <div className="card-body">
                    <figure className="bg-base-200 rounded-md">
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
                      <button className="btn btn-ghost">
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
