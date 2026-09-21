/** @type {import('next').NextConfig} */
const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  experimental: {
    // Raise the default 10MB middleware body cap so large video uploads reach
    // the /api/admin/upload proxy route (which itself forwards to the FastAPI
    // backend's own 200MB cap — see MAX_UPLOAD_SIZE_BYTES in backend/config.py).
    proxyClientMaxBodySize: "200mb",
  },
  async rewrites() {
    return [
      // The FastAPI backend is the only thing that ever writes files, storing
      // them under backend/database/images/ and serving them at /uploads/*.
      // This proxy keeps every <img>/<video> src in the (unchanged) frontend
      // components working with that exact same "/uploads/section/file.ext"
      // URL shape, without the Next.js app touching the filesystem itself.
      { source: "/uploads/:path*", destination: `${BACKEND_URL}/uploads/:path*` },
    ];
  },
};

module.exports = nextConfig;
