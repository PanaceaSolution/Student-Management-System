import { StatusCodes } from 'http-status-codes';

// General purpose error for Cloudinary-related issues.
export class CloudinaryError extends Error {
  constructor(message: string = 'Cloudinary service error', cause?: string) {
    super(`${message}${cause ? `: ${cause}` : ''}`);
    this.name = 'CloudinaryError';
  }
}

// General purpose error for database-related issues.
export class DatabaseError extends Error {
  constructor(message: string = 'Database error', cause?: string) {
    super(`${message}${cause ? `: ${cause}` : ''}`);
    this.name = 'DatabaseError';
  }
}

// Used for validation issues, such as invalid input or payload format.
export class ValidationError extends Error {
  constructor(message: string = 'Validation error', cause?: string) {
    super(`${message}${cause ? `: ${cause}` : ''}`);
    this.name = 'ValidationError';
  }
}

// Base class for all custom API errors.
export class CustomAPIError extends Error {
  public statusCode: number;

  constructor(message: string, public cause?: string) {
    super(`${message}${cause ? `: ${cause}` : ''}`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Use this when the client sends an invalid request.
export class BadRequestError extends CustomAPIError {
  constructor(message: string = 'Bad request', cause?: string) {
    super(message, cause);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

// Use this when a requested resource is not found.
export class NotFoundError extends CustomAPIError {
  constructor(message: string = 'Resource not found', cause?: string) {
    super(message, cause);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

// Use this when authentication is required but not provided or invalid.
export class UnauthenticatedError extends CustomAPIError {
  constructor(message: string = 'Unauthenticated', cause?: string) {
    super(message, cause);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}


// Use this when a user lacks permission to access a resource.
export class UnauthorizedError extends CustomAPIError {
  constructor(message: string = 'Unauthorized access', cause?: string) {
    super(message, cause);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

// Use this for server-side errors that are not specific to any cause.
export class InternalServerError extends CustomAPIError {
  constructor(message: string = 'Internal server error', cause?: string) {
    super(message, cause);
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

// Use this when a requested functionality has not been implemented.
export class NotImplementedError extends CustomAPIError {
  constructor(message: string = 'Not implemented', cause?: string) {
    super(message, cause);
    this.statusCode = StatusCodes.NOT_IMPLEMENTED;
  }
}

// Use this when the server is temporarily unavailable due to overload or maintenance.
export class ServiceUnavailableError extends CustomAPIError {
  constructor(message: string = 'Service unavailable', cause?: string) {
    super(message, cause);
    this.statusCode = StatusCodes.SERVICE_UNAVAILABLE;
  }
}

// Use this when a gateway or proxy times out while waiting for a response.
export class GatewayTimeoutError extends CustomAPIError {
  constructor(message: string = 'Gateway timeout', cause?: string) {
    super(message, cause);
    this.statusCode = StatusCodes.GATEWAY_TIMEOUT;
  }
}

// Use this when a conflict occurs, such as a duplicate resource creation.
export class ConflictError extends CustomAPIError {
  constructor(message: string = 'Conflict error', cause?: string) {
    super(message, cause);
    this.statusCode = StatusCodes.CONFLICT;
  }
}

// Use this when a required precondition is not met.
export class PreconditionFailedError extends CustomAPIError {
  constructor(message: string = 'Precondition failed', cause?: string) {
    super(message, cause);
    this.statusCode = StatusCodes.PRECONDITION_FAILED;
  }
}

// Use this when the request payload is too large.
export class PayloadTooLargeError extends CustomAPIError {
  constructor(message: string = 'Payload too large', cause?: string) {
    super(message, cause);
    this.statusCode = 413;
  }
}

// Use this when the server cannot process the media type of the request payload.
export class UnsupportedMediaError extends CustomAPIError {
  constructor(message: string = 'Unsupported media type', cause?: string) {
    super(message, cause);
    this.statusCode = StatusCodes.UNSUPPORTED_MEDIA_TYPE;
  }
}

// Use this when a resource is not acceptable according to the `Accept` headers.
export class NotAcceptableError extends CustomAPIError {
  constructor(message: string = 'Not acceptable', cause?: string) {
    super(message, cause);
    this.statusCode = StatusCodes.NOT_ACCEPTABLE;
  }
}

// Use this when the client request times out.
export class RequestTimeoutError extends CustomAPIError {
  constructor(message: string = 'Request timeout', cause?: string) {
    super(message, cause);
    this.statusCode = StatusCodes.REQUEST_TIMEOUT;
  }
}

// Use this when a client makes a request using an unsupported HTTP method.
export class MethodNotAllowedError extends CustomAPIError {
  constructor(message: string = 'Method not allowed', cause?: string) {
    super(message, cause);
    this.statusCode = StatusCodes.METHOD_NOT_ALLOWED;
  }
}
