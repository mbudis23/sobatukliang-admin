import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { writeFile } from "fs/promises";
import path from "path";

// ✅ Get all infografis
export async function GET() {
  const list = await prisma.infografis.findMany({
    include: { author: true },
  });
  return NextResponse.json(list);
}

// ✅ Create infografis
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const authorId = formData.get("authorId") as string;
    const file = formData.get("image") as File | null;

    let imageUrl = "";
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const tempPath = path.join("/tmp", file.name);
      await writeFile(tempPath, buffer);

      const uploadRes = await cloudinary.uploader.upload(tempPath, {
        folder: "infografis",
      });
      imageUrl = uploadRes.secure_url;
    }

    const newInfografis = await prisma.infografis.create({
      data: {
        title,
        description,
        imageUrl,
        authorId,
      },
    });

    return NextResponse.json(newInfografis);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create infografis" },
      { status: 500 }
    );
  }
}
