import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import Express from 'express';
import { CloudinaryConfig } from './cloudinary.config';
import Multer from 'multer';

@Injectable()
export class CloudinaryService {
  constructor(private cloudinaryConfig: CloudinaryConfig) {}
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      v2.uploader
        .upload_stream({ folder: 'student_documents' }, (error, result) => {
          if (error)
            return reject((error) => {
              console.log('error occured bro', error);
            });
          resolve(result);
        })
        .end(file.buffer);
    });
  }
}
