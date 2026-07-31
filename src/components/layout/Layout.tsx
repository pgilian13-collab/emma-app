import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useAccentColor } from '@hooks/useAccentColor';

interface LayoutProps {
  children?: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  useAccentColor();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-white">
      <Sidebar />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-4 pb-8 pt-4 sm:px-6 lg:px-8">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
