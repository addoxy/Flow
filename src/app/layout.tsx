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
      className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent scrollbar-thumb-rounded-full"
    >
      <body
        className={cn(
          'bg-background antialiased',
          manrope.className,
          process.env.NODE_ENV === 'development' && 'debug-screens'
        )}
      >
        <Providers>
          <div className="mx-auto h-full w-full max-w-screen-2xl">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
