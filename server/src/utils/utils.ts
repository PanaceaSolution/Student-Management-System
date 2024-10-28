export function generateRandomPassword(): string {
  return Math.random().toString(36).slice(-8);
}

let usernameCounter = 0;

export function generateUsername(fname: string, lname: string): string {
  usernameCounter += 1;
  const paddedCounter = usernameCounter.toString().padStart(3, '0');
  return `ST-${fname.charAt(0)}${lname.charAt(0)}${paddedCounter}`;
}
