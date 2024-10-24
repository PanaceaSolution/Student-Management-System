import { Controller, Post, Req, Get } from '@nestjs/common';
import { Request } from 'express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  async uploadFile(@Req() req: Request) {
    const file = req.files?.file; // 'file' is the key used in form-data
    if (!file) {
      return { message: 'No file uploaded' };
    }
    if (Array.isArray(file)) {
      return { message: 'Multiple files uploaded, only one file is expected' };
    }
    return await this.uploadService.uploadFile(file);
  }

  @Get()
  async getFiles() {
    return { message: 'No file uploaded' };
  }
}
