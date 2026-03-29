import { NextResponse } from "next/server";
import { hashPassword } from "../../../lib/password";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 },
    );
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name: name ?? null,
      email,
      password: hashedPassword,
      role: "user",
    },
  });

  return NextResponse.json({ id: user.id, email: user.email, name: user.name });
}
