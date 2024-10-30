import { UserProfileDto ,UserAddressDto,UserContactDto,UserDocumentsDto} from '../../user/userEntity/dto/common.dto';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested, IsString } from 'class-validator';

export class ParentDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @ValidateNested()
  @Type(() => UserProfileDto)
  profile: UserProfileDto;

  @ValidateNested({ each: true })
  @Type(() => UserAddressDto)
  addresses: UserAddressDto[];

  @ValidateNested()
  @Type(() => UserContactDto)
  contact: UserContactDto;

  @ValidateNested({ each: true })
  @Type(() => UserDocumentsDto)
  documents: UserDocumentsDto[];
}
