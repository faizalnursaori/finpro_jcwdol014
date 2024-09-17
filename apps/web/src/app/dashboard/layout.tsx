import React, { ReactNode } from 'react';
import DashboardMenu from '@/components/DashboardMenu';

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
