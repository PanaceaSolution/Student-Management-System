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
    const jsonFields = ['profile', 'contact', 'address', 'document'];

    try {
      jsonFields.forEach((field) => {
        if (req.body[field] && typeof req.body[field] === 'string') {
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
