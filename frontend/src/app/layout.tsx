import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts';

export const metadata: Metadata = {
  title: 'Aprove-me - Gerenciamento de Recebíveis',
  description: 'Sistema de gerenciamento de recebíveis e cedentes - Bankme',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
