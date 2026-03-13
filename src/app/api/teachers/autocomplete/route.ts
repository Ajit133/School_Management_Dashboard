import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (!q) {
    return NextResponse.json({ items: [] });
  }

  const terms = q
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);

  const where: {
    OR: Array<Record<string, unknown>>;
  } = {
    OR: [
      { name: { contains: q, mode: "insensitive" } },
      { surname: { contains: q, mode: "insensitive" } },
      { username: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ],
  };

  if (terms.length >= 2) {
    const first = terms[0];
    const rest = terms.slice(1).join(" ");

    where.OR.push({
      AND: [
        { name: { contains: first, mode: "insensitive" } },
        { surname: { contains: rest, mode: "insensitive" } },
      ],
    });

    where.OR.push({
      AND: [
        { name: { contains: rest, mode: "insensitive" } },
        { surname: { contains: first, mode: "insensitive" } },
      ],
    });
  }

  const items = await prisma.teacher.findMany({
    where,
    select: {
      id: true,
      name: true,
      surname: true,
      username: true,
      email: true,
    },
    orderBy: [{ name: "asc" }, { surname: "asc" }],
    take: 8,
  });

  return NextResponse.json({ items });
}
