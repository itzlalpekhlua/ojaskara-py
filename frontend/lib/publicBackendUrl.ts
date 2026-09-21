// Client-side (browser) counterpart to lib/api.ts's BACKEND_URL. That one is
// server-only (Next.js inlines NEXT_PUBLIC_* vars into the browser bundle;
// plain env vars stay server-side). Three "use client" components need to
// reach the backend directly from the browser: the admin login form, the
// logout button, and the media uploader.
//
// In single-server hosting (this app's default — see README.md), the
// frontend and backend share one origin, so this is left unset and every
// call below stays a same-origin relative path, exactly as before.
//
// In a split deployment (frontend on Vercel, backend hosted separately),
// set NEXT_PUBLIC_BACKEND_URL to the backend's public URL. It must be on the
// same parent domain as the frontend (e.g. "https://api.example.com" while
// the frontend is "https://app.example.com") with the backend's
// COOKIE_DOMAIN set to ".example.com" — see DEPLOYMENT.md. A `*.vercel.app`
// preview domain can't share cookies with any backend host, so the admin
// panel only works there with a custom domain configured this way.
export const PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";
