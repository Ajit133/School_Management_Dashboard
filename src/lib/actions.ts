"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ---------------------------------------------------------------------------
// Demo credential store – replace with a real DB query in production.
// ---------------------------------------------------------------------------
const CREDENTIALS = [
  { username: "admin",   password: "admin123",   role: "admin"   },
  { username: "teacher", password: "teacher123", role: "teacher" },
  { username: "student", password: "student123", role: "student" },
  { username: "parent",  password: "parent123",  role: "parent"  },
] as const;

const ROLE_HOME: Record<string, string> = {
  admin:   "/admin",
  teacher: "/teacher",
  student: "/student",
  parent:  "/parent",
};

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
export async function login(
  username: string,
  password: string
): Promise<{ error: string } | undefined> {
  // Trim to avoid whitespace mistakes
  const user = CREDENTIALS.find(
    (u) =>
      u.username === username.trim() &&
      u.password === password
  );

  if (!user) {
    return { error: "Invalid username or password." };
  }

  cookies().set("auth_role", user.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  redirect(ROLE_HOME[user.role]);
}

// ---------------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------------
export async function logout() {
  cookies().delete("auth_role");
  redirect("/sign-in");
}
