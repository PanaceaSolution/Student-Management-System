import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/DB/prisma.service';
import { CreateParentDto, UpdateParentDto } from './dto/parent.dto';

@Injectable()
export class ParentService {
  constructor(private prisma: PrismaService) {}

  async createParent(
    createParentDto: CreateParentDto,
  ): Promise<{ status: number; message: string; parent?: any; login?: any }> {
    const { fname, lname, email, address, phoneNumber } = createParentDto;

    await this.prisma.parent.create({
      data: {
        fname,
        lname,
        email,
        address,
        phoneNumber,
      },
    });

    const findParent = await this.prisma.parent.findUnique({
      where: {
        email: String(email),
      },
    });

    const parentId = findParent.id;
    const paddedId = parentId.toString().padStart(4, '0');
    let parentUsername = `PT-${fname.charAt(0)}${lname.charAt(0)}${paddedId}`;
    parentUsername = parentUsername.toUpperCase();
    const parentPassword = this.generateRandomPassword();

    const login = await this.prisma.login.create({
      data: {
        username: parentUsername,
        password: parentPassword,
        role: 'parent',
      },
    });

    const parent = await this.prisma.parent.update({
      where: {
        id: parentId,
      },
      data: {
        loginId: login.id,
      },
    });

    return {
      status: 200,
      message: 'Parent created successfully',
      parent: parent,
      login: login,
    };
  }

  async findParent(
    parentId: number,
  ): Promise<{ status: number; message?: string; parent?: any; login?: any }> {
    const findParent = await this.prisma.parent.findUnique({
      where: {
        id: Number(parentId),
      },
    });
    if (!parentId) {
      return {
        status: 400,
        message: 'parent does not exist',
      };
    }
    const login = await this.prisma.login.findFirst({
      where: {
        id: findParent.loginId,
      },
    });
    return {
      status: 200,
      message: 'parent found',
      parent: findParent,
      login: login,
    };
  }

  async updateParent(
    parentId: number,
    updateParentDto: UpdateParentDto,
  ): Promise<{ status: number; message?: string; parent?: any }> {
    const { fname, lname, email, address, phoneNumber } = updateParentDto;
    const findParent = this.findParent(parentId);
    if((await findParent).status == 200){
      const updatedParent = await this.prisma.parent.update({
        where: {
          id: Number(parentId),
        },
        data: {
          ...(fname !== undefined && { fname }),
          ...(lname !== undefined && { lname }),
          ...(email !== undefined && { email }),
          ...(address !== undefined && { address }),
          ...(phoneNumber !== undefined && { phoneNumber }),
        },
      });
      return {
        status: 200,
        message: 'Parent updated successfully',
        parent: updatedParent,
      };
    }else{
      return {
        status: 400,
        message: 'Parent not found',
      };
    }
  }

  async deleteParent(
    parentId: number,
  ): Promise<{ status: number; message?: string }> {
    const findParent = await this.prisma.parent.findUnique({
      where: { id: Number(parentId) },
    });
    if (!findParent) {
      return { status: 400, message: 'Parent not found' };
    }
    await this.prisma.parent.delete({ where: { id: parentId } });
    await this.prisma.login.delete({ where: { id: findParent.loginId } });
    return { status: 200, message: 'Parent deleted successfully' };
  }

  private generateRandomPassword(): string {
    return Math.random().toString(36).slice(-8);
  }
}
