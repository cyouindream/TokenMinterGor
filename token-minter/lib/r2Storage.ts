import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Initialize S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

const BUCKET_NAME = process.env.CLOUDFLARE_BUCKET_NAME!;
const PUBLIC_URL = process.env.CLOUDFLARE_PUBLIC_URL!;

/**
 * Upload a file to Cloudflare R2 storage
 * @param file - The file buffer to upload
 * @param fileName - The name of the file
 * @param contentType - The MIME type of the file
 * @returns The public URL of the uploaded file
 */
export async function uploadToR2(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  try {
    // Generate unique filename to prevent collisions
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${fileName}`;

    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: uniqueFileName,
      Body: file,
      ContentType: contentType,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    // Return the public URL
    const publicUrl = `${PUBLIC_URL}/${uniqueFileName}`;
    return publicUrl;
  } catch (error) {
    console.error("Error uploading to R2:", error);
    throw new Error("Failed to upload file to storage");
  }
}

/**
 * Validate image file
 * @param file - The file to validate
 * @returns True if valid, throws error if invalid
 */
export function validateImageFile(file: File): boolean {
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error("File size must be less than 5MB");
  }

  // Check file type
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("File must be an image (JPEG, PNG, GIF, or WebP)");
  }

  return true;
}
