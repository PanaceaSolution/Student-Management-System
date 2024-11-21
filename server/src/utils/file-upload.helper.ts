import { v2 as Cloudinary } from 'cloudinary';
import { Readable } from 'stream';

function bufferToStream(buffer: Buffer): Readable {
  const readable = new Readable();
  // readable._read = () => {};
  readable.push(buffer);
  readable.push(null);
  return readable;
}

export async function deleteFileFromCloudinary(publicId: string): Promise<void> {
  if (!publicId) {
    throw new Error('No public_id provided for deletion');
  }

  return new Promise((resolve, reject) => {
    Cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error('Error deleting file from Cloudinary:', error);
        return reject(new Error('Failed to delete file from Cloudinary'));
      }
      if (result.result === 'not found') {
        console.warn('File not found in Cloudinary:', publicId);
      } else {
        console.log('Cloudinary deletion result:', result);
      }
      resolve();
    });
  });
}

export async function uploadSingleFileToCloudinary(
  file: Express.Multer.File,
  folder: string,
): Promise<any> {
  if (!file || !file.buffer) {
    throw new Error('No file provided for upload');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = Cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) {
          console.error('Error uploading file to Cloudinary:', error);
          return reject(new Error('Failed to upload file to Cloudinary'));
        }
        if (!result) {
          return reject(
            new Error('Upload failed, no result returned from Cloudinary'),
          );
        }
        resolve(result);
      },
    );

    bufferToStream(file.buffer).pipe(uploadStream);
  });
}

export async function uploadFilesToCloudinary(
  files: Buffer[],
  folder: string,
): Promise<string[]> {
  const uploadPromises = files.map(
    (file) =>
      new Promise<string>((resolve, reject) => {
        const uploadOptions = { folder };

        const stream = bufferToStream(file);

        stream.pipe(
          Cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
            if (error) {
              console.error('Error uploading buffer to Cloudinary:', error);
              return reject(
                new Error('Failed to upload buffer to Cloudinary'),
              );
            }
            if (!result) {
              return reject(
                new Error('Upload failed, no result returned from Cloudinary'),
              );
            }
            resolve(result.secure_url);
          }),
        );
      }),
  );

  return Promise.all(uploadPromises);
}
export function extractPublicIdFromUrl(url: string): string {
  const parts = url.split('/');
  const fileNameWithExtension = parts.pop() || ''; 
  const folderPath = parts.slice(7).join('/');
  const fileName = fileNameWithExtension.split('.')[0]; 
  return `${folderPath}/${fileName}`;
}

