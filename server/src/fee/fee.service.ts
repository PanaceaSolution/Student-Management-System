import { Injectable } from '@nestjs/common';
import { PrismaService } from '../DB/prisma.service';
import { CreateFeeDto } from './dto/fee.dto';

@Injectable()
export class FeeService {
  constructor(private prisma: PrismaService) {}

  async createFee(
    createFeeDto: CreateFeeDto,
  ): Promise<{ status: number; message: string; fee?: any }> {
    const {
      amount,
      tax,
      extraCharges,
      discount,
      fine,
      total,
      priceInWords,
      dueDate,
      paid,
      paymentDate,
    } = createFeeDto;

    const fee = await this.prisma.fee.create({
      data: {
        amount,
        tax,
        extraCharges,
        discount,
        fine,
        total,
        priceInWords,
        dueDate,
        paid,
        paymentDate,
  
      },
    });

    return {
      status: 200,
      message: 'Fee created successfully',
      fee,  // Include the created fee in the response if needed
    };
  }
}