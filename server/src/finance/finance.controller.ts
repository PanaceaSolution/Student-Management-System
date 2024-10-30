// src/finance/finance.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Query,
  // Query,
} from '@nestjs/common';
import { FinanceService } from './finance.service';
import { Express } from 'express';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { FileInterceptor } from '@nestjs/platform-express';
// import { isUUID } from 'class-validator';

@Controller('finance')
export class FinanceController {
  financeRepository: any;
  constructor(private readonly financeService: FinanceService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createFinanceDto: CreateFinanceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
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
    return this.financeService.update(id, updateFinanceDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.financeService.remove(id);
  }

  // @Post(':id/initiate-payment')
  // async initiatePayment(
  //   @Param('id') id: string,
  //   @Body('amount') amount: number,
  //   @Body('months') months: string[],
  // ) {
  //   return this.financeService.initiatePayment(id, amount, months);
  // }

  // @Get('verify-payment')
  // async verifyPayment(
  //   @Query('pidx') pidx: string,
  //   @Query('status') status: string,
  //   @Query('amount') amount: string,
  //   @Query('transaction_id') transactionId: string
  // ) {
  //   console.log(
  //     `Received pidx: ${pidx}, status: ${status}, amount: ${amount}, transaction_id: ${transactionId}`,

  //   // Validate `pidx` as a UUID
  //   if (!pidx || !isUUID(pidx)) {
  //     console.error(`Invalid or missing pidx format: ${pidx}`);
  //     throw new BadRequestException('Invalid or missing pidx format');
  //   }

  //   // Verify payment only if status is "Completed"
  //   if (status !== 'Completed') {
  //     throw new BadRequestException('Payment was not completed');
  //   }

  //   // Call the service with validated parameters
  //   return this.financeService.verifyPayment(pidx, amount, transactionId);
  // }
  @Post(':id/initiate-payment')
  async initiatePayment(
    @Param('id') id: string,
    @Body('amount') amount: number,
    @Body('months') months: string[],
  ) {
    return this.financeService.initiatePayment(id, amount, months);
  }

  @Get('payment/verify')
  async verifyPayment(
    @Query('pidx') pidx: string,
    @Query('status') status: string,
    @Query('amount') amount: string,
    // @Query('transaction_id') transactionId: string,
  ) {
    if (!pidx || typeof pidx !== 'string' || pidx.trim() === '') {
      throw new BadRequestException('Invalid or missing pidx format');
    }
    if (status !== 'Completed') {
      throw new BadRequestException('Payment was not completed');
    }
    return this.financeService.verifyPayment(
      pidx,
      amount,
      //  transactionId
    );
  }
}
