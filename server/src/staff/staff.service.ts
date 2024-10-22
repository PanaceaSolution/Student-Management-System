import { Injectable } from '@nestjs/common';
import { PrismaService } from '../DB/prisma.service'; // Adjust path as necessary
import { CreateStaffDto } from './dto/staff.dto'; // Import your CreateStaffDto
import { Prisma } from '@prisma/client';
import moment from 'moment';
import { BadRequestException } from '@nestjs/common';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService) {}
  async createStaff(
    CreateStaffDto: CreateStaffDto,
  ): Promise<{ status: number; message: string; staff?: any; login?: any }> {
    const {
      fname,
      lname,
      email,
      address,
      phoneNumber,
      sex,
      bloodType,
      dob,
      role,
      salary,
    } = CreateStaffDto;

    const DOB = moment(dob, 'YYYY-MM-DD');
    if (!DOB.isValid()) {
      throw new BadRequestException('Invalid date format for Date of Birth');
    }
    const DobIsoString = DOB.toISOString();

    const ExistedStaff = await this.prisma.staff.findFirst({
      where: {
        email,
      },
    });
    if (ExistedStaff) {
      return {
        status: 400,
        message: 'Staff already exists',
      };
    }

    await this.prisma.staff.create({
      data: {
        fname,
        lname,
        email,
        address,
        sex,
        bloodType,
        dob: DobIsoString,
        role,
        salary,
        phoneNumber,
      },
    });
    const FindStaff = await this.prisma.staff.findUnique({
      where: {
        email: String(email),
      },
    });
    const StaffId = FindStaff.id;
    const paddedId = StaffId.toString().padStart(4, '0');
    let StaffUsername = `STF-${fname.charAt(0)}${lname.charAt(
      0,
    )}${paddedId}`.toUpperCase();

    const StaffPassword = this.generateRandomPassword();
    const login = await this.prisma.login.create({
      data: {
        username: StaffUsername,
        password: StaffPassword,
        role: role,
      },
    });
    const NewStaff = await this.prisma.staff.update({
      where: { id: StaffId },
      data: {
        username: StaffUsername,
        loginId: login.id,
      },
    });
    return {
      status: 200,
      message: 'Staff member created',
      staff: NewStaff,
      login: login,
    };
  }

  async getAllStaff() {
    return this.prisma.staff.findMany();
  }

  // Get a single staff member by ID
  async getStaffById(id: number) {
    return this.prisma.staff.findUnique({
      where: { id },
    });
  }

  // Update a staff member
  async updateStaff(id: number, data: UpdateStaffDto) {
    const updateData: Prisma.StaffUpdateInput = {};

    if (data.username !== undefined) updateData.username = data.username;
    if (data.fname !== undefined) updateData.fname = data.fname;
    if (data.lname !== undefined) updateData.lname = data.lname;

    if (data.dob !== undefined) {
      const dob = moment(data.dob, 'YYYY-MM-DD');
      if (!dob.isValid()) {
        throw new BadRequestException('Invalid date format for dob');
      }
      const dobIsoString = dob.toISOString(); // Convert to ISO string if valid
      updateData.dob = dobIsoString;
    }

    if (data.profilePicture !== undefined)
      updateData.profilePicture = data.profilePicture;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.phoneNumber !== undefined)
      updateData.phoneNumber = data.phoneNumber;
    if (data.sex !== undefined) updateData.sex = data.sex;
    if (data.bloodType !== undefined) updateData.bloodType = data.bloodType;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.salary !== undefined) updateData.salary = data.salary;

    if (data.loginId !== undefined) {
      updateData.login = {
        connect: { id: data.loginId },
      };
    }

    try {
      const updatedStaff = await this.prisma.staff.update({
        where: { id },
        data: updateData,
      });

      // Return an object with a success message and updated staff data
      return {
        message: 'Staff member updated successfully',
        staff: updatedStaff,
      };
    } catch (error) {
      throw new BadRequestException('Failed to update staff member');
    }
  }

  // Delete a staff member
  async deleteStaff(id: number) {
    const staff = await this.prisma.staff.findUnique({
      where: { id },
      include: { login: true }, // Ensure we get the associated login entry
    });

    if (!staff) {
      throw new BadRequestException('Staff member not found');
    }

    // Delete the associated login if it exists
    if (staff.login) {
      await this.prisma.login.delete({
        where: { id: staff.login.id },
      });
    }

    // Finally delete the staff member
    return this.prisma.staff.delete({
      where: { id },
    });
  }

  private generateRandomPassword(): string {
    return Math.random().toString(36).slice(-8);
  }
}
