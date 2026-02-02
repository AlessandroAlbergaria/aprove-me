import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <main className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Aprove-me
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Sistema de Gerenciamento de Recebíveis
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Fazer Login
          </Link>
          <Link
            href="/payables"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Ver Recebíveis
          </Link>
        </div>
      </main>
    </div>
  );
}
