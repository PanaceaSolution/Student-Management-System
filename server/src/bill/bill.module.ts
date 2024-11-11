import { Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';

@Module({
  controllers: [BillController],
  providers: [BillService],
})
export class BillModule {}
