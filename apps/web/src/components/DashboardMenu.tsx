'use client';
import Link from 'next/link';
import {
  LogOut,
  Gauge,
  ShieldCheck,
  User,
  ChartBarStacked,
  PackageSearch,
  Blocks,
  UsersRound,
  Store,
  TicketPercent,
  Layers,
  ClipboardList,
  ChartColumnBig,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';

export default function DashboardMenu() {
  const { data } = useSession();

  return (
    <div className="card card-compact bg-base-100 w-fit h-fit shadow-xl ml-7">
      <div className="card-body">
        <p className="card-title ml-4">Admin Center</p>
        <div className="divider m-0"></div>
        <ul className="menu w-56 p-0 gap-2">
          <li>
            <Link href="/dashboard">
              <Gauge />
              Dashboard
            </Link>
          </li>
          {data?.user?.role === 'SUPER_ADMIN' ? (
            <>
              <li>
                <details className="group">
                  <summary className="font-normal group-open:font-bold cursor-pointer list-none">
                    <UsersRound />
                    User Management
                  </summary>
                  <ul>
                    <li>
                      <Link href="/dashboard/admin-management">
                        <ShieldCheck />
                        Admin Management
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/user-management">
                        <User />
                        End-User Management
                      </Link>
                    </li>
                  </ul>
                </details>
              </li>
              <li>
                <Link href="/dashboard/store-management">
                  <Store />
                  Store Management
                </Link>
              </li>
            </>
          ) : (
            ''
          )}
          <li>
            <Link href="/dashboard/category-management">
              <ChartBarStacked />
              Category Management
            </Link>
          </li>
          <li>
            <Link href="/dashboard/product-management">
              <PackageSearch />
              Product Management
            </Link>
          </li>
          <li>
            <details className="group">
              <summary className="font-normal group-open:font-bold cursor-pointer list-none">
                <Blocks />
                Inventory Management
              </summary>
              <ul>
                <li>
                  <Link href="/dashboard/inventory-management">
                    <Layers />
                    Stock Management
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/inventory-management/request-management">
                    <ClipboardList />
                    Request Inventory Management
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/inventory-management/inventory-report">
                    <ChartColumnBig />
                    Stock Report
                  </Link>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <Link href="/dashboard/voucher-management">
              <TicketPercent />
              Voucher Management
            </Link>
          </li>
          <li>
            <Link href="/dashboard/order-management">
              <ClipboardList />
              Order Management
            </Link>
          </li>
          <li>
            <button
              className=""
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              <LogOut />
              Log Out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
