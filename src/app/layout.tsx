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
  description: 'Flow is a web app that helps you get things done.',
  authors: [{ name: 'Addoxy' }],
  category: 'Productivity',
  keywords: ['productivity', 'task', 'todo', 'notes', 'timer', 'audio'],
  metadataBase: new URL('https://flow.addoxy.me'),
  openGraph: {
    title: 'Flow',
    description: 'Flow is a web app that helps you get things done.',
    url: 'https://flow.addoxy.me',
    siteName: 'Flow',
    images: [
      {
        url: '/images/logo.png',
        width: 180,
        height: 180,
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="scrollbar-thumb-rounded-full scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent"
    >
      <body
        className={cn(
          'mx-auto h-screen min-h-screen max-w-screen-2xl bg-background antialiased',
          manrope.className,
          process.env.NODE_ENV === 'development' && 'debug-screens'
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
