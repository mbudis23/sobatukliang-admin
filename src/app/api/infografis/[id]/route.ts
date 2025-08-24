import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ Get infografis by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const item = await prisma.infografis.findUnique({
    where: { id },
    include: { author: true },
  });
  return NextResponse.json(item);
}

// ✅ Update infografis
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await req.json();
  const updated = await prisma.infografis.update({
    where: { id },
    data: body,
  });
  return NextResponse.json(updated);
}

// ✅ Delete infografis
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  await prisma.infografis.delete({ where: { id } });
  return NextResponse.json({ message: "Infografis deleted" });
}
