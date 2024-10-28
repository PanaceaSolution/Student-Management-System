import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FinanceService } from './finance.service';
import { Express } from 'express';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file')) //This line tells NestJS to expect a file upload
  async create(
    @Body() createFinanceDto: CreateFinanceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('Uploaded File:', file);

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.financeService.create(createFinanceDto, file);
  }

  @Get()
  findAll() {
    return this.financeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.financeService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateFinanceDto: UpdateFinanceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.financeService.update(id, updateFinanceDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.financeService.remove(id);
  }
}
