import { PartialType } from '@nestjs/mapped-types';
import { ParentDto } from './parent.dto';

export class UpdateParentDto extends PartialType(ParentDto) {}
