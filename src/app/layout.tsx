// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Metadata } from 'next';
import { Poppins } from 'next/font/google';

export const metadata: Metadata = {
  metadataBase: new URL('https://trisquare.eu')
};

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin']
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider
          theme={{ primaryColor: 'orange', fontFamily: poppins.style.fontFamily }}
          forceColorScheme={'light'}
        >
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
