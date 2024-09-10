'use client';

import { ThemeProvider } from 'next-themes';

const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="dark">
      {children}
    </ThemeProvider>
  );
};

export default Providers;
