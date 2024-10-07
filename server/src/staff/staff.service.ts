import { Injectable } from '@nestjs/common';
import { PrismaService } from '../DB/prisma.service'; // Adjust path as necessary
import { CreateStaffDto } from './dto/staff.dto'; // Import your CreateStaffDto
import { Prisma } from '@prisma/client';
@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new staff member
  async createStaff(data: CreateStaffDto) {
    return this.prisma.staff.create({
      data: {
        username: data.username,
        fname: data.fname,
        lname: data.lname,
        dob: data.dob,
        profilePicture: data.profilePicture,
        address: data.address,
        phoneNumber: data.phoneNumber,
        sex: data.sex,
        bloodType: data.bloodType,
        email: data.email,
        role: data.role,
        salary: data.salary,
        login: data.login 
          ? data.login.create 
            ? { create: data.login.create } 
            : data.login.connect 
              ? { connect: { id: data.login.connect.id } } 
              : undefined 
          : undefined, // Handle case when login is not provided
      },
    });
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
  async updateStaff(id: number, data: Prisma.StaffUpdateInput) {
    return this.prisma.staff.update({
      where: { id },
      data,
    });
  }

  // Delete a staff member
  async deleteStaff(id: number) {
    return this.prisma.staff.delete({
      where: { id },
    });
  }
}
