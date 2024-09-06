import { Drawer } from '@/components/Drawer';
import React, { ReactNode } from 'react';
import Footer from '@/components/Footer';
import FooterMobile from '@/components/FooterMobile';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      <div className="bg-slate-100 overflow-x-auto">
        <Drawer>{children}</Drawer>
      </div>
    </>
  );
}
