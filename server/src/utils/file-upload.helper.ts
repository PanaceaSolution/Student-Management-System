import { v2 as Cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { Express } from 'express';

// Helper function to convert buffer to stream
function bufferToStream(buffer: Buffer): Readable {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
}

// Function to delete a file from Cloudinary
export async function deleteFileFromCloudinary(publicId: string): Promise<void> {
  if (!publicId) {
    throw new Error("No public_id provided for deletion");
  }

  return new Promise((resolve, reject) => {
    Cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error("Error deleting file from Cloudinary:", error);
        return reject(new Error("Failed to delete file from Cloudinary"));
      }
      console.log("File deleted from Cloudinary:", result);
      resolve();
    });
  });
}

// Single file upload with error handling
export async function uploadSingleFileToCloudinary(
  file: Express.Multer.File,
  folder: string,
): Promise<any> {
  if (!file || !file.buffer) {
    throw new Error("No file provided for upload");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = Cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) {
          console.error("Error uploading file to Cloudinary:", error);
          return reject(new Error("Failed to upload file to Cloudinary"));
        }
        if (!result) {
          return reject(new Error("Upload failed, no result returned from Cloudinary"));
        }
        resolve(result);
      },
    );

    bufferToStream(file.buffer).pipe(uploadStream);
  });
}

// Multiple file upload with error handling
export async function uploadFilesToCloudinary(
  files: Express.Multer.File[],
  folder: string,
): Promise<string[]> { // Return type is now an array of secure URLs
  if (!Array.isArray(files) || files.length === 0) {
    throw new Error("No files provided for upload");
  }

  const uploadPromises = files.map((file) =>
    uploadSingleFileToCloudinary(file, folder)
      .then((result) => result.secure_url) // Extract only the secure URL from the result
      .catch((error) => {
        console.error(`Error uploading ${file.originalname} to Cloudinary:`, error);
        throw new Error(`Failed to upload ${file.originalname} to Cloudinary`);
      })
  );

  return Promise.all(uploadPromises);
}
