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

// single file upload
export function uploadSingleFileToCloudinary(
  file: Express.Multer.File,
  folder: string,
): Promise<any> {
  return new Promise((resolve, reject) => {
    const uploadStream = Cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      },
    );

    bufferToStream(file.buffer).pipe(uploadStream);
  });
}

// multiple file upload
export async function uploadFilesToCloudinary(
  files: Express.Multer.File[],
  folder: string,
): Promise<any[]> {
  const uploadPromises = files.map((file) =>
    uploadSingleFileToCloudinary(file, folder),
  );

  return Promise.all(uploadPromises);
}
