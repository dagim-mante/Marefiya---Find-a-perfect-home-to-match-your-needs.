/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [
            { protocol: "https", hostname: "lh3.googleusercontent.com" },
            {protocol: "https", hostname: "utfs.io"},
        ]
    }
};

export default nextConfig;
