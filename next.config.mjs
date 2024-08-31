/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "lh3.googleusercontent.com" },
            { protocol: "https", hostname: "avatars.githubusercontent.com" },
            {protocol: "https", hostname: "utfs.io"},
            {protocol: "https", hostname: "images.pexels.com"}
        ]
    }
};

export default nextConfig;
