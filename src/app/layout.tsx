// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://trisquare.eu')
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={{ primaryColor: 'violet' }}>{children}</MantineProvider>
      </body>
    </html>
  );
}
