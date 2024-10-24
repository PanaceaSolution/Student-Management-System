import { Injectable, BadRequestException } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.provider';
import { UploadedFile } from 'express-fileupload';

@Injectable()
export class UploadService {
  constructor(private readonly cloudinaryProvider: CloudinaryProvider) {}

  async uploadFile(file: UploadedFile): Promise<any> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      // Upload file to Cloudinary
      const result = await this.cloudinaryProvider.uploadImage(
        file.tempFilePath,
      );
      return result;
    } catch (error) {
      throw new BadRequestException('File upload failed', error.message);
    }
  }
}
