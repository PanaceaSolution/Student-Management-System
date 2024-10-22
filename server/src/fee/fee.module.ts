// src/fee/fee.module.ts
import { Module } from '@nestjs/common';
import { FeeService } from './fee.service';
import { FeeController } from './fee.controller';
import { PrismaModule } from '../DB/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FeeController],
  providers: [FeeService],
})
export class FeeModule {}