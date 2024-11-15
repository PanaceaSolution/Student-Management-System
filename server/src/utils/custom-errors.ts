export class CloudinaryError extends Error {
  constructor(message: string = 'Cloudinary service error', cause?: string) {
    super(`${message}: ${cause}`);
    this.name = 'CloudinaryError';
  }
}

export class DatabaseError extends Error {
  constructor(message: string = 'Database error', cause?: string) {
    super(`${message}: ${cause}`);
    this.name = 'DatabaseError';
  }
}

export class ValidationError extends Error {
  constructor(message: string = 'Validation error', cause?: string) {
    super(`${message}: ${cause}`);
    this.name = 'ValidationError';
  }
}