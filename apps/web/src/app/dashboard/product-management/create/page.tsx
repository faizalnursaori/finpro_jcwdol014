'use client';

import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { createProduct } from '@/api/products';
import { getCategories } from '@/api/category';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

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

const CreateProductPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    productName: '',
    productDescription: '',
    price: 0,
    category: 0,
    images: [],
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const { data } = useSession();

  useEffect(() => {
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
  }, []);

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
    const files = e.target.files;
    if (files) {
      const validFiles = Array.from(files).filter((file) => {
        const isValidType = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
        ].includes(file.type);
        const isValidSize = file.size <= 1048576;
        return isValidType && isValidSize;
      });

      if (validFiles.length !== files.length) {
        toast.error(
          'Some files are invalid. Only images up to 1 MB are allowed.',
        );
      }

      setFormData((prevData) => ({
        ...prevData,
        images: validFiles,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (error) {
      return;
    }

    const formPayload = new FormData();
    formPayload.append('name', formData.productName);
    formPayload.append('description', formData.productDescription);
    formPayload.append('price', formData.price.toString());
    formPayload.append('categoryId', formData.category.toString());

    formData.images.forEach((image) => {
      formPayload.append('images', image);
      console.log(formPayload);
    });

    try {
      await createProduct(formPayload as any);
      setError('');
      toast.success('Successfully created new product');
      router.push('/dashboard/product-management');
    } catch (error) {
      console.error('Failed to create product');
      setError('Failed to create product');
    }
  };

  return (
    <div className="content-wrapper">
      {data?.user?.role == 'SUPER_ADMIN' ? (
        <>
          <div>
            <Toaster />
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Create Product</h3>
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
                  <li>Create</li>
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
                              required
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
                              className="select w-full transition-all select-sm select-bordered focus:outline-offset-0"
                              required
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
                              className="textarea w-full transition-all textarea-bordered focus:outline-offset-0"
                              name="productDescription"
                              value={formData.productDescription}
                              onChange={handleChange}
                              required
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
                              required
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
                    <div className="card-body">
                      <div className="card-title">Upload Product Images</div>
                      <div className="mt-1">
                        <input
                          className="file-input file-input-bordered w-full max-w-xs"
                          type="file"
                          id="images"
                          name="images"
                          multiple
                          onChange={handleFileChange}
                          required
                        />
                        <div className="label">
                          <span className="label-text-alt">
                            Max 1 MB with types of .jpg, .jpeg, .png dan .gif
                            Only
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <button type="submit" className="btn btn-primary">
                    Create Product
                  </button>
                  <button
                    type="button"
                    className="btn ms-4"
                    aria-label="Cancel"
                    onClick={() =>
                      (window.location.href = '/products-management')
                    }
                  >
                    Cancel
                  </button>
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

export default CreateProductPage;
