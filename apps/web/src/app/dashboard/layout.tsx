import { Drawer } from '@/components/Drawer';
import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="bg-slate-100 overflow-x-auto">
      <Drawer>{children}</Drawer>
    </div>
  );
}
