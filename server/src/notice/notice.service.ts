import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notice } from './entities/notice.entity';
import { Repository } from 'typeorm';
import { uploadSingleFileToCloudinary } from 'src/utils/file-upload.helper';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
  ) {}

  async create(
    createNoticeDto: CreateNoticeDto,
    file?: Express.Multer.File,
  ): Promise<Notice> {
    const notice = this.noticeRepository.create(createNoticeDto);

    if (file) {
      const uploadResult = await uploadSingleFileToCloudinary(file, 'notices');
      // console.log('Image', uploadResult);

      notice.filePath = uploadResult.secure_url;
    }
    return this.noticeRepository.save(notice);
  }

  async findAll(): Promise<Notice[]> {
    return this.noticeRepository.find();
  }

  async findOne(noticeID: string): Promise<Notice> {
    const notice = await this.noticeRepository.findOne({ where: { noticeID } });
    if (!notice) {
      throw new NotFoundException('Notice with ID ${noticeID} not found');
    }
    return notice;
  }

  async update(
    noticeID: string,
    updateNoticeDto: UpdateNoticeDto,
    file?: Express.Multer.File,
  ): Promise<Notice> {
    const notice = await this.findOne(noticeID);
    Object.assign(notice, updateNoticeDto);

    if (file) {
      const uploadResult = await uploadSingleFileToCloudinary(file, 'notices');
      notice.filePath = uploadResult.secure_url;
    }
    return this.noticeRepository.save(notice);
  }

  async remove(noticeID: string): Promise<{ message: string }> {
    const result = await this.noticeRepository.delete(noticeID);
    if (result.affected == 0) {
      throw new NotFoundException('Notice with ID ${noticeID} not found');
    }
    return { message: 'Deleted successfully' };
  }
}
