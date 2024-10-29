import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { Finance } from './entities/finance.entity';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Finance]), HttpModule, ConfigModule],
  controllers: [FinanceController],
  providers: [FinanceService],
})
export class FinanceModule {}
