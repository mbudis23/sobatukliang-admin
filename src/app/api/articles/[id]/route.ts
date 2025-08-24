import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ Get article by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      subsections: {
        include: { paragraphs: true },
      },
      author: true,
    },
  });
  return NextResponse.json(article);
}

// ✅ Update article
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await req.json();
  const updated = await prisma.article.update({
    where: { id },
    data: body,
  });
  return NextResponse.json(updated);
}

// ✅ Delete article
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  await prisma.article.delete({ where: { id } });
  return NextResponse.json({ message: "Article deleted" });
}
