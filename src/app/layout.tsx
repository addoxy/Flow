import Providers from '@/lib/providers';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Flow',
  description: 'Get work done!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn('h-screen min-h-screen w-screen bg-background antialiased', inter.className)}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
