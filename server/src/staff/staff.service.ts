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

  // Create a new staff member
  // Create a new staff member
async createStaff(data: CreateStaffDto) {
  // Ensure the date is valid and convert to ISO-8601 format
  const dob = moment(data.dob, 'YYYY-MM-DD');
  if (!dob.isValid()) {
    throw new BadRequestException('Invalid date format for dob');
  }
  const dobIsoString = dob.toISOString();

  const createdStaff = await this.prisma.staff.create({
    data: {
      username: data.username,
      fname: data.fname,
      lname: data.lname,
      dob: dobIsoString,
      profilePicture: data.profilePicture,
      address: data.address,
      phoneNumber: data.phoneNumber,
      sex: data.sex,
      bloodType: data.bloodType,
      email: data.email,
      role: data.role, // Set the role for the staff member
      salary: data.salary,
      login: data.login
        ? data.login.create
          ? { create: { 
              username: data.login.create.username, 
              password: data.login.create.password,
              role: data.login.create.role // Include the role here
            } }
          : data.login.connect
            ? { connect: { id: data.login.connect.id } }
            : undefined
        : undefined,
    },
  });

  return {
    message: 'Staff member created successfully',
    staff: createdStaff, // Return the created staff member data if needed
  };
}


  // Get all staff members
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

    if (data.profilePicture !== undefined) updateData.profilePicture = data.profilePicture;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber;
    if (data.sex !== undefined) updateData.sex = data.sex;
    if (data.bloodType !== undefined) updateData.bloodType = data.bloodType;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.salary !== undefined) updateData.salary = data.salary;

    if (data.loginId !== undefined) {
        updateData.login = {
            connect: { id: data.loginId }
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
    return this.prisma.staff.delete({
      where: { id },
    });
  }
}