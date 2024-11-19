import { Controller, Get, Post, Body, Param, Put, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { Notice } from './entities/notice.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('notices')
export class NoticeController {
    constructor(private readonly noticeService: NoticeService) {}

    @Post('/create')
    @UseInterceptors(FileInterceptor('file'))
    async create(@Body() createNoticeDto: CreateNoticeDto, @UploadedFile() file: Express.Multer.File): Promise<Notice> {
        return this.noticeService.create(createNoticeDto, file);
    }

    @Get()
    async findAll(): Promise<Notice[]> {
        return this.noticeService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') noticeID: string): Promise<Notice> {
        return this.noticeService.findOne(noticeID);
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('file')) 
    async update(
        @Param('id') noticeID: string,
        @Body() updateNoticeDto: UpdateNoticeDto,
        @UploadedFile() file: Express.Multer.File
    ): Promise<Notice> {
        return this.noticeService.update(noticeID, updateNoticeDto, file);
    }

    @Delete(':id')
    async remove(@Param('id') noticeID: string): Promise<{message:string}> {
        return this.noticeService.remove(noticeID);
    }
}