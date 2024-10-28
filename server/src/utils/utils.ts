// export function generateRandomPassword(): string {
//   return Math.random().toString(36).slice(-8);
// }

// let usernameCounter = 0;

// export function generateUsername(fname: string, lname: string): string {
//   usernameCounter += 1;
//   const paddedCounter = usernameCounter.toString().padStart(3, '0');
//   return `ST-${fname.charAt(0)}${lname.charAt(0)}${paddedCounter}`;
// }

import { ROLE, STAFFROLE } from "./role.helper";

export function generateRandomPassword(): string {
  return Math.random().toString(36).slice(-8);
}

export function generateUsername(fname: string, lname: string, role?: ROLE, staffRole?: STAFFROLE): string {
  const random_number = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit random number
  let prefix = 'ST';

  if (role === ROLE.PARENT) {
    prefix = 'PR';
  } else if (role === ROLE.STAFF) {
    if (staffRole === STAFFROLE.TEACHER) {
      prefix = 'TR';
    } else if (staffRole === STAFFROLE.ACCOUNTANT) {
      prefix = 'AC';
    } else if (staffRole === STAFFROLE.LIBRARIAN) {
      prefix = 'LB';
    }
  }

  return `${prefix}-${fname.charAt(0)}${lname.charAt(0)}${random_number}`;
}
