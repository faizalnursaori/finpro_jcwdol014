import type { Metadata } from 'next';
import './globals.css';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Hemart',
  description: 'Grocery store built with NextJS',
};

type LayoutProps = {
  children: ReactNode;
  dashboard: ReactNode;
};

export default function RootLayout({ children, dashboard }: LayoutProps) {
  return (
    <html lang="en">
      <body>{dashboard || children}</body>
    </html>
  );
}
