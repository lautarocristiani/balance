/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jlkvcwnzxnwcrqwsookh.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/product_images/**',
      },
      // El dominio de las imágenes de respaldo
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;