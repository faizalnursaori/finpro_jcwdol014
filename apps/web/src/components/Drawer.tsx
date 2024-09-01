import Link from 'next/link';
import React, { ReactNode } from 'react';

interface DrawerProps {
  children: ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ children }) => {
  const menuItems = [
    { label: 'Dashboard', href: '/' },
    {
      label: 'User Management',
      submenu: [
        {
          label: 'Admin',
          href: '/dashboard/admin/admin-management',
        },
        {
          label: 'End-User',
          href: '/dashboard/admin/enduser-management',
        },
      ],
    },
    { label: 'Product Management', href: '/dashboard/product' },
    { label: 'Warehouse', href: '/dashboard/warehouse' },
  ];

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col mx-3 items-start">
        {/* Toggle Button */}
        <label htmlFor="my-drawer-2" className="btn drawer-button lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </label>
        {/* Page content */}
        <div className="w-full">{children}</div>
      </div>
      <div className="drawer-side min-h-full">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu bg-white text-base-content min-h-full w-64 p-4">
          <h2 className="font-bold mb-4">Admin Center</h2>
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.submenu ? (
                <div className="collapse collapse-arrow">
                  <input type="checkbox" />
                  <div className="collapse-title font-medium">{item.label}</div>
                  <div className="collapse-content">
                    <ul className="ml-4">
                      {item.submenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link href={subItem.href}>{subItem.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <Link href={item.href}>{item.label}</Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
