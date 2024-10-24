import { v2 as Cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CloudinaryProvider {
  constructor(private configService: ConfigService) {
    Cloudinary.config({
      cloud_name: 'dydfwjo0j',
      api_key: '146677511282996',
      api_secret: '_7ZC0Ysl5cBiN0b_pbpqyGLDrr4',
    });
  }

  async uploadImage(filePath: string) {
    return Cloudinary.uploader.upload(filePath, { folder: 'uploads' });
  }
}
