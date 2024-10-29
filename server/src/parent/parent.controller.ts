import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ParentService } from './parent.service';
import { ParentDto,  } from './dto/parent.dto';

@Controller('parent')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Post('/create')
  async createParent(
    @Body() createParentDto: ParentDto,
  ): Promise<{ status: number; message: string; parent?: any; login?: any }> {
    return this.parentService.createParent(createParentDto);
  }

//   @Get('/:parentId')
//   async findParent(
//     @Param('parentId') parentId: number,
//   ): Promise<{ status: number; message?: string; parent?: any }> {
//     return this.parentService.findParent(parentId);
//   }

//   @Put('/update/:parentId')
//   async updateParent(
//     @Param('parentId') parentId: number,
//     @Body() updateParentDto: UpdateParentDto,
//   ): Promise<{ status: number; message?: string; parent?: any }> {
//     return this.parentService.updateParent(parentId, updateParentDto);
//   }

//   @Delete('/delete/:parentLoginId')
//   async deleteParent(
//     @Param('parentLoginId') parentLoginId: number,
//   ): Promise<{ status: number; message?: string }> {
//     return this.parentService.deleteParent(parentLoginId);
//   }
}
