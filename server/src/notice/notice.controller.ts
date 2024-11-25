import { Controller, Get, Post, Body, Param, Put, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { Notice } from './entities/notice.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import ResponseModel from 'src/utils/utils'; 

@Controller('notices')
export class NoticeController {
    constructor(private readonly noticeService: NoticeService) {}

    @Post('/create')
    @UseInterceptors(FileInterceptor('file'))
    async create(
        @Body() createNoticeDto: CreateNoticeDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        try {
            const notice = await this.noticeService.create(createNoticeDto, file);
            return ResponseModel.success('Notice created successfully', notice); 
        } catch (error) {
            return ResponseModel.error('Failed to create notice', error.message); 
        }
    }

    @Get()
    async findAll() {
        try {
            const notices = await this.noticeService.findAll();
            return ResponseModel.success('Notices retrieved successfully', notices); 
        } catch (error) {
            return ResponseModel.error('Failed to retrieve notices', error.message); 
        }
    }

    @Get(':id')
    async findOne(@Param('id') noticeID: string) {
        try {
            const notice = await this.noticeService.findOne(noticeID);
            return ResponseModel.success('Notice retrieved successfully', notice); 
        } catch (error) {
            return ResponseModel.error('Failed to retrieve notice', error.message); 
        }
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('file')) 
    async update(
        @Param('id') noticeID: string,
        @Body() updateNoticeDto: UpdateNoticeDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        try {
            const updatedNotice = await this.noticeService.update(noticeID, updateNoticeDto, file);
            return ResponseModel.success('Notice updated successfully', updatedNotice); 
        } catch (error) {
            return ResponseModel.error('Failed to update notice', error.message); 
        }
    }

    @Delete(':id')
    async remove(@Param('id') noticeID: string) {
        try {
            await this.noticeService.remove(noticeID);
            return ResponseModel.success('Notice removed successfully', null); 
        } catch (error) {
            return ResponseModel.error('Failed to remove notice', error.message); 
        }
    }
}