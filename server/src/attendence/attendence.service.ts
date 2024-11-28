import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Attendence } from './entities/attendence.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateAttendanceDto,
  StudentAttendanceDto,
} from './dto/attendence.dto';
import { DeepPartial, Equal, In, Repository } from 'typeorm';
import { Class } from 'src/classes/entities/class.entity';
import { Student } from 'src/student/entities/student.entity';
import { User } from 'src/user/authentication/entities/authentication.entity';
import { generateAndUploadExcelSheet } from 'src/utils/file-upload.helper';

import ResponseModel from 'src/utils/utils';
import { NotAcceptableError } from 'src/utils/custom-errors';

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

  async saveAttendence(createAttendenceDto: CreateAttendanceDto) {
    console.log('Received createAttendenceDto:', createAttendenceDto);
    try {
      const todayDate = new Date().toLocaleDateString();
      const { className, section, students } = createAttendenceDto;
      const classIds = [];
      const classDetails = [];
      const studentLists = [];
  
      const classData = await this.classRepository.findOne({
        where: { className, section },
        relations: ['students'],
      });
      console.log('classData', classData);
  
      if (!classData) {
        return ResponseModel.error(
          'Class not found for attendance',
          'Maybe Invalid class that you entered, Check Again',
        );
      }
  
      const { classId } = classData;
      classIds.push(classId);
      classDetails.push({ className, section });
  
      for (const studentDto of students) {
        const { rollNumber, fname, lname, isPresent } = studentDto;
  
        console.log('student dto', studentDto);

        if (isPresent?.toString() !== 'P' && isPresent?.toString() !== 'A') {
         throw new NotAcceptableError(`invalid in put for isPresent: ${isPresent}`);
        }
  
        const studentsData = await this.studentRepository.find({
          where: {
            studentClass: {
              classId: classData.classId,
            },
            rollNumber: rollNumber,
          },
          relations: ['user', 'user.profile', 'studentClass'], 
        });
        studentLists.push(...studentsData);
        console.log(
          'Querying students with studentClassId:',
          classData.classId,
        );
  
        if (studentsData.length === 0) {
          console.warn('No students found for class:', classData.classId);
          continue;
        }
  
        const userIds = studentsData
          .filter(
            (student) =>
              student.user &&
              student.user.profile &&
              student.user.profile.fname === fname &&
              student.user.profile.lname === lname,
          ) 
          .map((student) => student.user.userId);
        console.log('users with userIds', userIds);
  
        if (userIds.length === 0) {
          console.warn('No matching users found for student:', studentDto);
          continue; 
        }
  
        const usersData = await this.userRepository.find({
          where: {
            userId: In(userIds),
          },
          relations: ['profile'],
        });
        console.log('users data:', usersData);
  
        let attendance = await this.attendenceRepository.findOne({
          where: {
            date: new Date(todayDate),
          },
        });
  
        if (attendance) {
          if (attendance.classId.includes(classIds.join()))
            attendance.classId = [
              ...new Set([...attendance.classId, ...classIds]),
            ];
        } else {
          attendance = this.attendenceRepository.create({
            classId: classIds,
            date: todayDate,
          });
        }
  
        for (const student of studentsData) {
          console.log('Student before updating isPresent:', student);
  
          if (!Array.isArray(student.isPresent)) {
            student.isPresent = [];
          }
          student.isPresent.push(isPresent.toString());
          await this.studentRepository.save(student);
        }
  
        await this.attendenceRepository.save(attendance);
      }
  
      const filteredStudentLists = studentLists.map((student) => ({
        rollNumber: student.rollNumber,
        fname: student.user.profile.fname,
        lname: student.user.profile.lname,
        isPresent: student.isPresent,
      }));
  
      const response = {
        message: 'Attendance saved at attendance table successfully',
        class: classDetails,
        students: filteredStudentLists,
      };
  
      return ResponseModel.success(response.message, response);
    } catch (error) {
      console.error('Error while saving attendance:', error);
      throw ResponseModel.error('Error while saving attendance', error);
    }
  }
  
}
