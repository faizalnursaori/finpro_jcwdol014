'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const OrderSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get('orderId');
    if (id) {
      setOrderId(id);
    } else {
      // Redirect to home if no orderId is provided
      router.push('/');
    }
  }, [searchParams, router]);

  return (
    <div className="container mx-auto p-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <h2 className="card-title text-2xl mb-4 justify-center">
            Payment Successfully!
          </h2>

          <div className="text-5xl text-success mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <p className="mb-4">Your order id is #{orderId}.</p>
          <p className="mb-6">
            Our team will verify your payment shortly. You will receive a
            confirmation email once the payment is confirmed.
          </p>

          <div className="card-actions justify-center">
            <Link href={`/order/${orderId}`} className="btn btn-primary">
              View Order Details
            </Link>
            <Link href="/" className="btn btn-ghost">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
