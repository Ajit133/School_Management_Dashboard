import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/sign-in"];
const AUTH_COOKIE = "auth_role";

type Role = "admin" | "teacher" | "student" | "parent";

const ROLE_HOME: Record<Role, string> = {
  admin: "/admin",
  teacher: "/teacher",
  student: "/student",
  parent: "/parent",
};

// Paths that only specific roles may access
const PROTECTED_PATHS: { pattern: RegExp; allowed: Role[] }[] = [
  { pattern: /^\/admin(\/|$)/, allowed: ["admin"] },
  { pattern: /^\/teacher(\/|$)/, allowed: ["teacher"] },
  { pattern: /^\/student(\/|$)/, allowed: ["student"] },
  { pattern: /^\/parent(\/|$)/, allowed: ["parent"] },
  { pattern: /^\/list\/subjects(\/|$)/, allowed: ["admin"] },
  { pattern: /^\/list\/(teachers|students|parents|classes|lessons)(\/|$)/, allowed: ["admin", "teacher"] },
];

function getRoleHome(role: string): string {
  return ROLE_HOME[role as Role] ?? "/sign-in";
}

function isAllowed(role: string, pathname: string): boolean {
  for (const { pattern, allowed } of PROTECTED_PATHS) {
    if (pattern.test(pathname)) {
      return allowed.includes(role as Role);
    }
  }
  return true;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get(AUTH_COOKIE)?.value;

  // Authenticated users hitting a public route → go straight to their dashboard
  if (PUBLIC_ROUTES.includes(pathname)) {
    if (role) {
      return NextResponse.redirect(
        new URL(getRoleHome(role), request.url)
      );
    }
    return NextResponse.next();
  }

  // Root path → redirect based on auth state
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(role ? getRoleHome(role) : "/sign-in", request.url)
    );
  }

  // Unauthenticated request to any protected route → sign-in
  if (!role) {
    const url = new URL("/sign-in", request.url);
    return NextResponse.redirect(url);
  }

  // Role does not have access to this path → redirect to their own dashboard
  if (!isAllowed(role, pathname)) {
    return NextResponse.redirect(new URL(getRoleHome(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)",
  ],
};
