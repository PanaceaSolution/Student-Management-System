import { Module } from '@nestjs/common';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { PrismaModule } from '../DB/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ClassController],
  providers: [ClassService],
})
export class ClassModule {}
