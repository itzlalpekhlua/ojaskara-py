import { NextRequest, NextResponse } from "next/server";
import { sessionCookie, verifySession } from "@/lib/session";

// Every /api/admin/* and /api/contact endpoint is now served directly by the
// FastAPI backend (single server — see backend/main.py's reverse proxy), so
// this middleware only ever needs to gate the admin *pages*.
export const config = {
  matcher: ["/admin/:path*"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(sessionCookie.name)?.value;
  const session = await verifySession(token);

  if (session) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin/login", request.url);
  return NextResponse.redirect(loginUrl);
}
