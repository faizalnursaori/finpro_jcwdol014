'use client';

import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { fetchProduct, updateProduct } from '@/api/products';
import { getCategories } from '@/api/category';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export interface FormData {
  productName: string;
  productDescription: string;
  price: number;
  category: number;
  images: File[];
}

export interface Category {
  id: string;
  name: string;
}

const EditProductPage: React.FC = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const [formData, setFormData] = useState<FormData>({
    productName: '',
    productDescription: '',
    price: 0,
    category: 0,
    images: [],
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const { data } = useSession();

  useEffect(() => {
    if (productId) {
      fetchProduct(productId)
        .then((data) => {
          setFormData(data);
        })
        .catch((error) => {
          console.error('Failed to fetch product:', error);
          toast.error('Product ID not found');
          window.location.href = '/dashboard/product-management';
        });
    }

    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        if (!res.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = res.data;
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories');
      }
    };

    fetchCategories();
  }, [productId]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target.files || []);
    setFormData((prevData) => ({
      ...prevData,
      images: files,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const formPayload = new FormData();
    formPayload.append('name', formData.productName);
    formPayload.append('description', formData.productDescription);
    formPayload.append('price', String(formData.price));
    formPayload.append('categoryId', String(formData.category));

    formData.images.forEach((image, index) => {
      formPayload.append('images', image);
    });

    try {
      if (productId) {
        await updateProduct(productId, formPayload as any);

        window.location.href = '/dashboard/product-management';
        toast.success('Successfully Update Product');
      } else {
        toast.error('Product ID not found');
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message);
    }
  };

  return (
    <div className="content-wrapper min-w-full md:min-w-fit">
      {data?.user?.role == 'SUPER_ADMIN' ? (
        <>
          <Toaster />
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Edit Product</h3>
              <div
                aria-label="Breadcrumbs"
                className="breadcrumbs text-sm hidden p-0 sm:inline"
              >
                <ul>
                  <li>Dashboard</li>
                  <li>
                    <a href="/dashboard/product-management">
                      Product Management
                    </a>
                  </li>
                  <li>Edit</li>
                </ul>
              </div>
            </div>
            <div className="mt-5">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                  <div
                    aria-label="Card"
                    className="card bg-base-100 card-bordered"
                  >
                    <div className="card-body gap-0">
                      <div className="card-title">Product Information</div>
                      <div className="mt-1 grid grid-cols-1 gap-5 gap-y-3 md:grid-cols-2">
                        <div>
                          <label htmlFor="productName" className="label">
                            <span className="label-text cursor-pointer">
                              Product Name
                            </span>
                          </label>
                          <div className="form-control flex flex-row items-center rounded-box border border-base-content/20">
                            <input
                              id="productName"
                              placeholder="Product Name"
                              className="input w-full transition-all input-sm input-bordered focus:outline-offset-0"
                              name="productName"
                              value={formData.productName}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="category" className="label">
                            <span className="label-text cursor-pointer">
                              Category
                            </span>
                          </label>
                          <div className="form-control flex flex-row items-center rounded-box border border-base-content/20">
                            <select
                              id="category"
                              name="category"
                              value={formData.category}
                              onChange={handleChange}
                              className="select w-full transition-all select-bordered select-sm focus:outline-offset-0"
                            >
                              <option value="">Select Category</option>
                              {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <label htmlFor="productDescription" className="label">
                            <span className="label-text cursor-pointer">
                              Product Description
                            </span>
                          </label>
                          <div className="form-control flex flex-row items-center rounded-box border border-base-content/20">
                            <textarea
                              id="productDescription"
                              placeholder="Product Description"
                              name="productDescription"
                              value={formData.productDescription}
                              onChange={handleChange}
                              className="textarea textarea-bordered w-full transition-all h-24"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="price" className="label">
                            <span className="label-text cursor-pointer">
                              Price
                            </span>
                          </label>
                          <div className="form-control flex flex-row items-center rounded-box border border-base-content/20">
                            <input
                              id="price"
                              type="number"
                              placeholder="Price"
                              className="input w-full transition-all input-sm input-bordered focus:outline-offset-0"
                              name="price"
                              value={formData.price}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    aria-label="Card"
                    className="card bg-base-100 card-bordered"
                  >
                    <div className="card-body gap-0">
                      <div className="card-title">Product Images</div>
                      <div className="mt-1">
                        <input
                          className="file-input file-input-bordered w-full max-w-xs"
                          type="file"
                          id="images"
                          name="images"
                          multiple
                          onChange={handleFileChange}
                        />
                        <div className="label">
                          <span className="label-text-alt">
                            Max 1 MB with types of .jpg, .jpeg, .png and .gif
                            Only
                          </span>
                        </div>
                        <div className="mt-4">
                          {formData.images && formData.images.length > 0 && (
                            <div className="grid grid-cols-4 gap-2">
                              {formData.images.map((images: any, index) => (
                                <div key={index} className="relative">
                                  <Image
                                    src={images.url}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-32 object-contain rounded"
                                    width={100}
                                    height={100}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card mt-5 bg-base-100 card-bordered">
                  <div className="card-body">
                    <div className="flex justify-start">
                      <button className="btn btn-primary">
                        Update Product
                      </button>
                      <button
                        type="button"
                        className="btn ms-4"
                        aria-label="Cancel"
                        onClick={() =>
                          (window.location.href =
                            '/dashboard/product-management')
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center items-center flex-col p-3">
            <h2 className="text-3xl text-center my-2">
              You Don't have an access to this page.
            </h2>
            <div className="mt-4 flex w-80 items-center justify-center gap-8">
              <Link
                className="relative flex items-center justify-center text-xl no-underline outline-none transition-opacity hover:opacity-80 active:opacity-60"
                href="/"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="m12 19-7-7 7-7"></path>
                  <path d="M19 12H5"></path>
                </svg>
                <span className="flex items-center">Back to Homepage</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EditProductPage;
