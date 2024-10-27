// eslint-disable-next-line @typescript-eslint/no-require-imports
import withMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  output: process.env.DEV ? 'standalone' : 'export',
  // Optionally, add any other Next.js config below
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack']
    });

    return config;
  },
  images: {
    unoptimized: true
  }
};

export default withMDX()(nextConfig);
