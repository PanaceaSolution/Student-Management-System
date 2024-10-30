import { Controller, Post, Req, Get } from '@nestjs/common';
import { Request } from 'express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  async uploadFile(@Req() req: Request) {
    // Use a type assertion to specify the expected structure of req.files
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const file = files?.file; // 'file' is the key used in form-data
    
    // Check if 'file' exists and is an array
    if (!file) {
      return { message: 'No file uploaded' };
    }

    if (Array.isArray(file) && file.length > 1) {
      return { message: 'Multiple files uploaded, only one file is expected' };
    }

    // Assuming only one file is uploaded
    return await this.uploadService.uploadFile(file[0]);
  }

  @Get()
  async getFiles() {
    return { message: 'No file uploaded' };
  }
}
