
// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { AuthProvider } from '@/contexts/AuthContext';

// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Project Hosting Manager',
  description: 'Manage project hosting environments easily',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      //  className={inter.className}
      >
        <AntdRegistry>
          <AuthProvider>
            {children}
          </AuthProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
