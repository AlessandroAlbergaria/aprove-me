import React from 'react';
import { Header } from './Header';

export interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  showNav?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title,
  showNav = true,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={title} showNav={showNav} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Aprove-me - Sistema de Gerenciamento
            de Recebíveis
          </p>
        </div>
      </footer>
    </div>
  );
};
