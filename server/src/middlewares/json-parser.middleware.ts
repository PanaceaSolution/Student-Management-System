import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JsonParserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const jsonFields = ['profile', 'contact', 'address', 'document','childNames'];

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

    jsonFields.forEach((field) => {
      if (req.body[field]) {
        console.log(`Field: ${field}, Type: ${typeof req.body[field]}`);
      }
    });

    console.log('After parsing:', req.body);
    next();
  }
}
