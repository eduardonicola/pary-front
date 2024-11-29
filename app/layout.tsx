import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { Montserrat } from 'next/font/google';
import icon from "../public/favi.svg"
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gerenciador de Eventos',
  description: 'Aplicação para gerenciamento de eventos e divisão de despesas',
};

const montserrat = Montserrat({
  subsets: ['latin'], 
  weight: ['400', '700'], 
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} ${montserrat.className}`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}