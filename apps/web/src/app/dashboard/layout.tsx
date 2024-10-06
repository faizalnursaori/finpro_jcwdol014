import React, { ReactNode } from 'react';
import DashboardMenu from '@/components/DashboardMenu';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Dashboard',
    template: '%s | Hemart',
  },
};

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <main>
      <div className=" flex justify-normal overflow-x-auto gap-5">
        <DashboardMenu />
        {children}
      </div>
    </main>
  );
}
