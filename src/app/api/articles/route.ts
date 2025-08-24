import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";
import cloudinary from "../utils/cloudinary";

// ✅ Get all articles
export async function GET() {
  const articles = await prisma.article.findMany({
    include: {
      subsections: {
        include: {
          paragraphs: true,
        },
      },
      author: true,
    },
  });
  return NextResponse.json(articles);
}

// ✅ Create article
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const authorId = formData.get("authorId") as string;
    const file = formData.get("image") as File | null;

    let imageUrl: string | null = null;

    if (file) {
      // simpan file sementara
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const tempPath = path.join("/tmp", file.name);
      await writeFile(tempPath, buffer);

      // upload ke cloudinary
      const uploadRes = await cloudinary.uploader.upload(tempPath, {
        folder: "articles",
      });
      imageUrl = uploadRes.secure_url;
    }

    const article = await prisma.article.create({
      data: {
        title,
        imageUrl,
        authorId,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}
