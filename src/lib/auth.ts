"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const CREDENTIALS = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "teacher", password: "teacher123", role: "teacher" },
  { username: "student", password: "student123", role: "student" },
  { username: "parent", password: "parent123", role: "parent" },
] as const;

const ROLE_HOME: Record<string, string> = {
  admin: "/admin",
  teacher: "/teacher",
  student: "/student",
  parent: "/parent",
};

export async function login(
  username: string,
  password: string
): Promise<{ error: string } | undefined> {
  const user = CREDENTIALS.find(
    (candidate) =>
      candidate.username === username.trim() &&
      candidate.password === password
  );

  if (!user) {
    return { error: "Invalid username or password." };
  }

  cookies().set("auth_role", user.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect(ROLE_HOME[user.role]);
}

export async function logout() {
  cookies().delete("auth_role");
  redirect("/sign-in");
}