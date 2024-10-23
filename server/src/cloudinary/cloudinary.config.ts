import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CloudinaryConfig {
  constructor(private configService: ConfigService) {
    this.initializeCloudinary();
  }

  private initializeCloudinary() {
    cloudinary.config({
      cloud_name: 'dydfwjo0j',
      api_key: '146677511282996',
      api_secret: '_7ZC0Ysl5cBiN0b_pbpqyGLDrr4',
    });
  }
}
