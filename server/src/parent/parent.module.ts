import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParentService } from './parent.service';
import { ParentController } from './parent.controller';
import { Parent } from './entities/parent.entity';
import { User } from '../user/authentication/entities/authentication.entity';
import { UserProfile } from '../user/userEntity/profile.entity';
import { UserAddress } from '../user/userEntity/address.entity';
import { UserContact } from '../user/userEntity/contact.entity';
import { UserDocuments } from '../user/userEntity/document.entity';
import { Student } from '../student/entities/student.entity'; // If needed for student-parent relation

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Parent,
      User,
      UserProfile,
      UserAddress,
      UserContact,
      UserDocuments,
      Student, // Include Student if Parent has a relation with Student
    ]),
  ],
  controllers: [ParentController],
  providers: [ParentService],
  exports: [ParentService], // Export ParentService if needed elsewhere
})
export class ParentModule {}
