// eslint-disable-next-line @typescript-eslint/no-require-imports
import withMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  output: process.env.DEV ? 'standalone' : 'export',
  // Optionally, add any other Next.js config below
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  images: {
    unoptimized: true
  }
};

export default withMDX()(nextConfig);
