'use client';

import { useState, useEffect, useMemo } from 'react';
import { getAllOrders, updateStatusOrder } from '@/api/admin';
import { formatRupiah } from '@/utils/currencyUtils';
import { Search } from '../Search';
import { Pagination } from '../Pagination';
import { ErrorAlert } from '../ErrorAlert';
import Swal from 'sweetalert2';

interface Order {
  id: number;
  name: string;
  paymentStatus: string;
  shippingCost: number;
  total: number;
  paymentMethod: string;
  paymentProof: string;
  expirePayment: string;
  warehouseId: number;
  cartId: number;
  addressId: number;
  voucherId: any;
  shippedAt: number;
  cancellationSource: any;
  createdAt: string;
  updatedAt: string;
  items: any;
  warehouse: any;
  cart: any;
  address: any;
  voucher: any;
}

interface Warehouse {
  id: number;
  name: string;
}

type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER';

export const OrderTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [userRole, setUserRole] = useState<UserRole>('USER');

  const fetchOrders = async (page: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await getAllOrders(
        page,
        limit,
        selectedWarehouse || undefined,
      );
      if (!res.ok) {
        if (res.message === 'Admin is not assigned to a warehouse') {
          throw new Error(
            'You are not assigned to any warehouse. Please contact the Super Admin.',
          );
        }
        throw new Error(res.message || 'Failed to fetch orders');
      }

      const data = res.data;
      setOrders(data.orders);
      setFilteredOrders(data.orders);
      setTotalPages(data.pagination.totalPages);
      if (data.warehouses) setWarehouses(data.warehouses);
      if (data.userRole) setUserRole(data.userRole);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, selectedWarehouse]);

  // Handle payment status change
  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const res = await updateStatusOrder(orderId, newStatus);
      if (!res.ok)
        throw new Error(res.message || 'Failed to update payment status');

      if (newStatus === 'CANCELED') {
        Swal.fire({
          icon: 'warning',
          title: 'Payment Rejected',
          text: 'Payment proof has been rejected. Order status reverted to PENDING.',
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Payment Status has been successfully updated to ${newStatus}`,
        });
      }

      // Update the filteredOrders state
      const updatedOrders = filteredOrders.map((order) =>
        order.id === orderId ? { ...order, paymentStatus: newStatus } : order,
      );
      setFilteredOrders(updatedOrders);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Search functionality optimized with memoization
  const handleSearch = (query: string) => {
    const lowerQuery = query.toLowerCase();
    if (query === '') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(
        (order) =>
          (order.name?.toLowerCase() || '').includes(lowerQuery) ||
          (order.address?.name?.toLowerCase() || '').includes(lowerQuery) ||
          (order.warehouse?.name?.toLowerCase() || '').includes(lowerQuery),
      );
      setFilteredOrders(filtered);
    }
  };

  const handleClearSearch = () => setFilteredOrders(orders);

  // Memoized available statuses based on current status
  const getAvailableStatuses = useMemo(
    () => (currentStatus: string) => {
      switch (currentStatus) {
        case 'PAID':
          return ['SHIPPED'];
        case 'SHIPPED':
          return ['DELIVERED'];
        case 'DELIVERED':
          return [];
        case 'CANCELED':
          return ['PENDING'];
        case 'PENDING':
          return ['PAID', 'CANCELED'];
        default:
          return [];
      }
    },
    [],
  );

  // Pagination control
  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleWarehouseChange = (warehouseId: string) => {
    setSelectedWarehouse(
      warehouseId === 'all' ? null : parseInt(warehouseId, 10),
    );
    setCurrentPage(1);
  };

  if (loading) return <span className="loading loading-bars loading-lg"></span>;
  if (error) return <ErrorAlert message={error} />;

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex flex-row justify-between my-3 mx-3 gap-10">
          <Search onSearch={handleSearch} onClear={handleClearSearch} />
          {userRole === 'SUPER_ADMIN' && warehouses.length > 0 && (
            <select
              onChange={(e) => handleWarehouseChange(e.target.value)}
              className="select select-bordered select-sm"
              value={selectedWarehouse || 'all'}
            >
              <option value="all">All Warehouses</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <table className="table w-full">
          <thead>
            <tr>
              <th>Id</th>
              <th>Order Number</th>
              <th>Name</th>
              <th>Address</th>
              <th>Warehouse</th>
              <th>Total</th>
              <th>Shipping Cost</th>
              <th>Payment Method</th>
              <th>Payment Proof</th>
              <th>Payment Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={index}>
                <td>{order.id}</td>
                <td>{order.name}</td>
                <td>{order.address.name ?? '-'}</td>
                <td>{order.address.address ?? '-'}</td>
                <td>{order.warehouse.name ?? '-'}</td>
                <td>{formatRupiah(order.total)}</td>
                <td>{formatRupiah(order.shippingCost)}</td>
                <td>{order.paymentMethod}</td>
                <td>
                  {order.paymentProof ? (
                    <a
                      className="btn btn-sm btn-outline btn-primary"
                      href={order.paymentProof}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '10px' }}
                    >
                      View Proof
                    </a>
                  ) : (
                    'No proof available'
                  )}
                </td>
                <td>
                  <select
                    value={order.paymentStatus}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className="select select-bordered select-sm"
                    disabled={
                      getAvailableStatuses(order.paymentStatus).length === 0
                    }
                  >
                    <option value={order.paymentStatus} disabled>
                      {order.paymentStatus}
                    </option>
                    {getAvailableStatuses(order.paymentStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td></td>
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
    </>
  );
};
