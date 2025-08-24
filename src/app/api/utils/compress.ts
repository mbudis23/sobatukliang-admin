import sharp from "sharp";

// Kompres buffer sebelum upload ke Cloudinary
export async function compressImage(fileBuffer: Buffer) {
  return await sharp(fileBuffer)
    .resize(1280) // Maksimal lebar 1280px
    .jpeg({ quality: 70 }) // Kompres kualitas 70%
    .toBuffer();
}
