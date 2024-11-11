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
  const random_number = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit random number
  let prefix = 'ST';

  if (role === ROLE.PARENT) {
    prefix = 'PR';
  } else if (role === ROLE.ADMIN) {
    prefix = 'AD';
  } else if (role === ROLE.STAFF) {
    if (staffRole === STAFFROLE.TEACHER) {
      prefix = 'TR';
    } else if (staffRole === STAFFROLE.ACCOUNTANT) {
      prefix = 'AC';
    } else if (staffRole === STAFFROLE.LIBRARIAN) {
      prefix = 'LB';
    }
    prefix = 'STF';
  }

  return `${prefix}-${fname.charAt(0)}${lname.charAt(0)}${random_number}`;
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
