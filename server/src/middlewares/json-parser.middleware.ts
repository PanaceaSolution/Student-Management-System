// src/middlewares/json-parser.middleware.ts
import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JsonParserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Fields that are expected to be JSON strings
    const jsonFields = ['profile', 'contact', 'address', 'document', 'salary',];

    console.log('Before parsing' ,req.body)

    try {
      jsonFields.forEach((field) => {
        if (req.body[field] && typeof req.body[field] === 'string') {
          // Attempt to parse the JSON string
          req.body[field] = JSON.parse(req.body[field]);
        }
      });
    } catch (error) {
      throw new BadRequestException(
        `Invalid JSON format in one of the fields: ${error.message}`,
      );
    }
   console.log('After parsing:', req.body);
    next();
  }
}
