import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { PrismaService } from '../DB/prisma.service'; // Adjust path as necessary

@Module({
  controllers: [StaffController],
  providers: [StaffService, PrismaService],
})
export class StaffModule {}
