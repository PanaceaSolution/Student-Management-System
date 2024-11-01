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
export async function uploadFilesToCloudinary(filePaths: string[], folder: string): Promise<string[]> {
  const uploadPromises = filePaths.map((filePath) =>
    new Promise<string>((resolve, reject) => {
      Cloudinary.uploader.upload(
        filePath,
        { folder },
        (error, result) => {
          if (error) {
            console.error('Error uploading to Cloudinary:', error);
            return reject(new Error('Failed to upload to Cloudinary'));
          }
          if (!result) {
            return reject(new Error('Upload failed, no result returned from Cloudinary'));
          }
          resolve(result.secure_url);
        }
      );
    })
  );

  return Promise.all(uploadPromises);
}
