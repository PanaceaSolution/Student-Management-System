import { Module } from '@nestjs/common';
import { ParentService } from './parent.service';
import { ParentController } from './parent.controller';

@Module({
  controllers: [ParentController],
  providers: [ParentService],
})
export class ParentModule {}
