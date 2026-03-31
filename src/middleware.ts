import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Nur Admin-Routen schuetzen (nicht /login und nicht /api)
  if (pathname.startsWith("/admin")) {
    const session = request.cookies.get("elabel_session");

    if (!session?.value) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Session-Signatur serverseitig pruefen ist in Middleware nicht moeglich
    // (kein Zugriff auf process.env zur Laufzeit in Edge Middleware bei allen Setups)
    // Die vollstaendige Validierung erfolgt in den Server Components/Actions
  }

  // X-Robots-Tag fuer oeffentliche E-Label-Seiten
  if (pathname.startsWith("/p/")) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/p/:path*"],
};
