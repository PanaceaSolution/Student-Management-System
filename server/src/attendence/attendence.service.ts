import { Injectable } from '@nestjs/common';
import { Attendence } from './entities/attendence.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAttendanceDto } from './dto/attendence.dto';
import { Equal, In, Repository } from 'typeorm';
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
  ) { }

  async saveAttendence(createAttendenceDto: CreateAttendanceDto) {
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
      // console.log('classData', classData);

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

        // console.log('student dto', studentDto);

        const studentsData = await this.studentRepository.find({
          where: {
            studentClass: {
              classId: classData.classId,
            },
            rollNumber: rollNumber,
          },
          relations: ['user', 'user.profile', 'studentClass'], // Ensure user relation is loaded
        });
        studentLists.push(...studentsData);
        // console.log('student data', studentsData);

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
          ) // Ensure student has a user and matches fname and lname
          .map((student) => student.user.userId);
        // console.log('users with userIds', userIds);

        if (userIds.length === 0) {
          console.warn('No matching users found for student:', studentDto);
          continue; // Skip to the next studentDto if no matching users found
        }

        const usersData = await this.userRepository.find({
          where: {
            userId: In(userIds),
          },
          relations: ['profile'],
        });
        // console.log('users data:', usersData);

        let attendance = await this.attendenceRepository.findOne({
          where: {
            date: new Date(todayDate),
          },
        });

        // console.log('attendecnce', attendance);

        if (attendance) {
          if (
            attendance.classId &&
            attendance.classId.includes(classIds.join())
          ) {
            attendance.classId = [
              ...new Set([...attendance.classId, ...classIds]),
            ];
          } else if (!attendance.classId) {
            attendance.classId = classIds;
          }
        } else {
          attendance = this.attendenceRepository.create({
            classId: classIds,
            date: todayDate,
          });
        }

        // console.log('attendence', attendance);
        // console.log('student data', studentsData);

        if (isPresent?.toString() !== 'P' && isPresent?.toString() !== 'A') {
          return ResponseModel.error("Attendence value is not valid", "Invalid attendence")
        }
        // Update isPresent field for the student
        for (const student of studentsData) {
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

  async generateAttendence(className: string, section: string) {
    try {
      // Fetch the attendance records for the specific class
      const classData = await this.classRepository.findOne({
        where: { className, section },
        relations: ['students', 'students.user', 'students.user.profile'],
      });

      // console.log(classData.attendences);

      if (!classData) {
        return ResponseModel.error(
          'Class not found',
          `No class found with name: ${className} and section: ${section}.`,
        );
      }
      // console.log('Fetching attendance for classId:', classData.classId);
      const attendanceRecords = await this.attendenceRepository.find({
        where: { classId: Equal(classData.classId) }, // Now using the found classId
      });

      // console.log('attendece record', attendanceRecords);

      if (attendanceRecords.length === 0) {
        return ResponseModel.error(
          'No attendance records found for the selected class',
          `No attendance data exists for the class: ${classData.className} and section :${classData.section}.`,
        );
      }

      const classDetails = `Class: ${classData.className}, Section: ${classData.section}`;
      const sheetData = [];

      for (const record of attendanceRecords) {
        // Prepare student attendance data for the specific date
        const studentData = classData.students.map((student) => [
          student.rollNumber,
          student.user.profile.fname,
          student.user.profile.lname,
          student.isPresent?.[record.date.toISOString()] ? 'P' : 'A', // Assuming `isPresent` is a map or array indexed by date
        ]);

        //  console.log("studdent", studentData);

        const sheetName = `Class_${classData.className}_${new Date().toISOString().split('T')[0]
          }.xlsx`
          .replace(/[^a-zA-Z0-9_]/g, '') // Remove special characters
          .slice(0, 31); // Ensure the name is within 31 characters

        // Add a new sheet for the specific attendance record
        sheetData.push({
          sheetName,
          topHeaderValues: [`Date: ${record.date}`, classDetails],
          headers: ['Roll Number', 'First Name', 'Last Name', 'Is Present'],
          data: studentData,
        });
      }
      // console.log('sheetData', sheetData);

      if (sheetData.length === 0) {
        return ResponseModel.error(
          'No attendance data for the selected class',
          `No attendance data exists for the class:${className} and section:${section}`,
        );
      }

      const fileName = `Attendance_${classData.className
        }_${new Date().toISOString()}`;
      const uploadedUrl = await generateAndUploadExcelSheet(
        sheetData,
        fileName,
      );

      return ResponseModel.success(
        'Attendance Excel sheet generated successfully',
        { url: uploadedUrl },
      );
    } catch (error) {
      console.error(
        'Error generating attendance Excel sheet for class:',
        error,
      );
      throw ResponseModel.error(
        'Error generating attendance Excel sheet',
        error,
      );
    }
  }
}