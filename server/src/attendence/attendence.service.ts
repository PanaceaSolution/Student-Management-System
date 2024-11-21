import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Attendence } from './entities/attendence.entity';
import { AttendenceController } from './attendence.controller';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAttendanceDto } from './dto/attendence.dto';
import { DeepPartial, Equal, Repository } from 'typeorm';
import { Class } from 'src/classes/entities/class.entity';
import { Student } from 'src/student/entities/student.entity';
import { User } from 'src/user/authentication/entities/authentication.entity';
import { UserProfile } from 'src/user/userEntity/profile.entity';

@Injectable()
export class AttendenceService {
  constructor(
    @InjectRepository(Attendence)
    private readonly attendenceRepository: Repository<Attendence>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newAttendances = [];
    for (const attendanceRecord of attendances) {
      const { studentId, isPresent, userId } = attendanceRecord;

      const userData = await this.userRepository.findOne({
        where: {
          userId: Equal(userId),
        },
        relations: ['profile'],
      });

      if (!userData || !userData.profile) {
        throw new BadRequestException('User or user profile not found');
      }

      const {
        profile: { fname, lname },
      } = userData;

      const studentData = await this.studentRepository.findOne({
        where: {
          studentId: Equal(studentId.toString()),
        },
      });
      if (!studentData) {
        throw new BadRequestException('Student not available to do attendance');
      }

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
        user: { userId } as any,
        class: { classId } as any,
        date: new Date(),
        isPresent,
      } as DeepPartial<Attendence>);
      newAttendances.push(attendence);
    }
    await this.attendenceRepository.save(newAttendances);
    console.log('Attendence Details', newAttendances);

    // Fetch the attendances with user profile information
    const attendancesWithProfile = await this.attendenceRepository.find({
      where: {
        date: today,
        class: { classId },
      },
      relations: ['user', 'user.profile', 'student'],
    });

    return {
      status: 201,
      message: 'Attendance created successfully',
      date: today,
      class: className,
      section: section,
      newAttendances: attendancesWithProfile.map((att) => ({
        attendanceId: att.attendanceId,
        studentId: att.student.studentId,
        rollNumber: att.student.rollNumber,
        firstName: att.user.profile.fname,
        lastName: att.user.profile.lname,
        isPresent: att.isPresent,
      })),
      success: true,
    };
  }
}
