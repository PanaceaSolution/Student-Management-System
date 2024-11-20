import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Attendence } from './entities/attendence.entity';
import { AttendenceController } from './attendence.controller';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAttendanceDto } from './dto/attendence.dto';
import { Equal, Repository } from 'typeorm';
import { Class } from 'src/classes/entities/class.entity';
import { Student } from 'src/student/entities/student.entity';

@Injectable()
export class AttendenceService {
  constructor(
    @InjectRepository(Attendence)
    private readonly attendenceRepository: Repository<Attendence>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}
  async createAttendence(createAttendenceDto: CreateAttendanceDto) {
    const { classId, attendances } = createAttendenceDto;

    const classData = await this.classRepository.findOne({
      where: {
        classId,
      },
    });
    if (!classData) {
      throw new BadRequestException('Class not found');
    }
    const { section, className } = classData;

    console.log('class data is', classData);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newAttendances = [];
    for (const attendanceRecord of attendances) {
      const { studentId, isPresent } = attendanceRecord;

      const studentData = await this.studentRepository.findOne({
        where: {
          studentId: Equal(studentId.toString()),
        },
      });
      if (!studentData) {
        throw new BadRequestException('student not availabe to do attendance');
      }
      console.log('student data', studentData);

      const existingAttendenceForToday =
        await this.attendenceRepository.findOne({
          where: {
            date: today,
          },
        });
      if (existingAttendenceForToday) {
        throw new BadRequestException(
          'You cannot create an attendance twice a day.',
        );
      }

      const attendence = this.attendenceRepository.create({
        student: { studentId } as any,
        section: section.toString(),
        className: className.toString(),
        class: { classId } as any,
        date: new Date(),
        isPresent,
      });
      newAttendances.push(attendence);
    }
    await this.attendenceRepository.save(newAttendances);

    return {
      status: 201,
      message: 'Attendance created successfully',
      date: today,
      class: className,
      section: section,
      newAttendances: newAttendances.map((att) => ({
        // attendanceId: att.attendanceId,
        studentId: att.student.studentId,
        isPresent: att.isPresent,
      })),
      success: true,
    };
  }
}
