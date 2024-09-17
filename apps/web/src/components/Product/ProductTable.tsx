'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { DeleteProductModal } from './DeleteProductModal';
import { Search } from '../Search';
import { NewProduct } from './ButtonAddProduct';
import { Pagination } from '../Pagination';
import toast, { Toaster } from 'react-hot-toast';
import {
  deleteProduct,
  getProductsbyPage,
  searchProduct,
} from '@/api/products';
import Image from 'next/image';

interface ProductImage {
  url: string;
}

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string;
  createdAt: Date;
  category: Category;
  productImages: ProductImage[];
}

export const ProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit] = useState<number>(5);
  const { data } = useSession();

  const fetchProducts = async (page: number) => {
    setLoading(true);
    try {
      const res = await getProductsbyPage(page, limit);
      if (!res.ok) {
        toast.error('Failed to fetch products');
      }
      const data = res.data;
      setProducts(data.products);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedProduct) {
      try {
        const res = await deleteProduct(selectedProduct.id);
        if (!res.ok) {
          toast.error('Failed to delete Product');
        }
        setProducts(
          products.filter((product) => product.id !== selectedProduct.id),
        );
        setDeleteModalOpen(false);
        setSelectedProduct(null);
      } catch (error) {
        toast.error((error as Error).message);
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSearch = async (query: string) => {
    try {
      const res = await searchProduct(query);
      if (!res.ok) {
        toast.error('Failed to search product');
      }
      setProducts(res.data.products);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleClearSearch = () => {
    fetchProducts(currentPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <span className="loading loading-bars loading-lg"></span>;

  return (
    <>
      <Toaster />
      <div className="overflow-x-auto">
        <div className="flex flex-row justify-between my-3 mx-3 gap-10">
          <Search onSearch={handleSearch} onClear={handleClearSearch} />
          {data?.user?.role === 'SUPER_ADMIN' ? <NewProduct /> : ''}
        </div>
        <table className="table w-full">
          <thead>
            <tr>
              <th>Id</th>
              <th>Product Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Price</th>
              <th>Created At</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td>{product.id}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <Image
                          src={product.productImages[0].url}
                          alt="Product Picture"
                          width={100}
                          height={100}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{product.name}</div>
                    </div>
                  </div>
                </td>
                <td>{product.description}</td>
                <td>{product.category.name}</td>
                <td>{`Rp ${product.price.toLocaleString('id-ID')}`}</td>
                <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                {data?.user?.role === 'SUPER_ADMIN' ? (
                  <th>
                    <button className={`btn btn-ghost btn-xs`}>
                      <Link
                        href={`/dashboard/product-management/edit?productId=${product.id}`}
                      >
                        Edit
                      </Link>
                    </button>
                    <button
                      className={`btn btn-ghost btn-xs`}
                      onClick={() => handleDeleteClick(product)}
                    >
                      Delete
                    </button>
                  </th>
                ) : (
                  ''
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {selectedProduct && isDeleteModalOpen && (
        <DeleteProductModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};
