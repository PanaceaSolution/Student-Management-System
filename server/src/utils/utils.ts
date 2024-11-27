import { BadRequestException } from '@nestjs/common';
import { ROLE } from './role.helper';
import { STAFFROLE } from './role.helper';
import * as crypto from 'crypto';

export function generateRandomPassword(): string {
  try {
    return Math.random().toString(36).slice(-8);
  } catch (error) {
    throw new BadRequestException('Error while creating password', {
      cause: new Error(),
      description: 'Error while creating password',
    });
  }
}

export function generateUsername(
  fname: string,
  lname: string,
  role?: ROLE,
  staffRole?: STAFFROLE,
): string {
  const random_number = Math.floor(1000 + Math.random() * 9000);
  let prefix = 'UN';
  if (role === ROLE.STUDENT) {
    prefix = 'ST';
  } else if (role === ROLE.PARENT) {
    prefix = 'PR';
  } else if (role === ROLE.ADMIN) {
    prefix = 'AD';
  } else if (role === ROLE.STAFF) {
    console.log(`Generating username - Role: ${role}, Staff Role: ${staffRole}`);
    switch (staffRole) {
      case STAFFROLE.TEACHER:
        prefix = 'TR';
        break;
      case STAFFROLE.ACCOUNTANT:
        prefix = 'AC';
        break;
      case STAFFROLE.LIBRARIAN:
        prefix = 'LB';
        break;
      default:
        prefix = 'STF';
    }
  }

  return `${prefix}-${fname.charAt(0).toUpperCase()}${lname.charAt(0).toUpperCase()}${random_number}`;
}

export function encryptdPassword(password: string): string {
  const buffer = Buffer.from(password, 'utf-8');
  const encrypted = crypto.publicEncrypt(
    {
      key: process.env.PUBLIC_KEY,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    buffer,
  );
  return encrypted.toString('base64');
}

export function decryptdPassword(encryptedPassword: string): string {
  const buffer = Buffer.from(encryptedPassword, 'base64');
  const decrypted = crypto.privateDecrypt(
    {
      key: process.env.PRIVATE_KEY,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    buffer,
  );
  return decrypted.toString('utf-8');
}

export default class ResponseModel<T> {
  message: string;
  success: boolean;
  // statusCodes?: number;
  data?: T;
  error?: string;

  constructor(message: string, success: boolean, data?: T, error?: string) {
    this.message = message;
    this.success = success;
    this.data = data;
    this.error = error;
  }

  static success<T>(message: string, data: T): ResponseModel<T> {
    return new ResponseModel<T>(message, true, data);
  }

  static error<T>(message: string, error: string): ResponseModel<T> {
    return new ResponseModel<T>(message, false, undefined, error);
  }
}
