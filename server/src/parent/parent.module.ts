import { Module } from '@nestjs/common';
import { ParentController } from './parent.controller';
import { ParentService } from './parent.service';
import { PrismaModule } from '../DB/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ParentController],
  providers: [ParentService],
})
export class ParentModule {}
