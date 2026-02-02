'use client';

import React from 'react';
import Link from 'next/link';

export interface HeaderProps {
  title?: string;
  showNav?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Aprove-me',
  showNav = true,
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">{title}</h1>
            </Link>
          </div>

          {showNav && (
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/payables"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Recebíveis
              </Link>
              <Link
                href="/assignors"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Cedentes
              </Link>
            </nav>
          )}

          {showNav && (
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
