import Providers from '@/lib/providers';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';

const manrope = Manrope({
  subsets: ['latin'],
});

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'debug-screens h-screen min-h-screen w-screen bg-background antialiased',
          manrope.className
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
