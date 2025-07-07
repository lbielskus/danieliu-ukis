import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Danielių Kiemas - Patirtis gamtoje su danieliais',
  description:
    'Patirkite europietiškų danielių grožį jų natūralioje aplinkoje. Užsisakykite gido ekskursiją jau šiandien!',
  generator: 'v0.dev',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster position='top-right' />
        </AuthProvider>
      </body>
    </html>
  );
}
