import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(
    { message: "/api/auth/signup is active" },
    { status: 200 }
  );
}

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Validasi field
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 }
      );
    }

    // Cek apakah email sudah ada
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah digunakan" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    // Generate token
    const token = generateToken(newUser.id);

    // Simpan session
    await prisma.session.create({
      data: {
        userId: newUser.id,
        token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 jam
      },
    });

    return NextResponse.json(
      {
        message: "Signup berhasil",
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup Error:", error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
