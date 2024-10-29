import { Module } from "@nestjs/common";
import { ParentController } from "./parent.controller";
import { ParentService } from "./parent.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Parent } from "./entities/parent.entity";
import { Student } from "../student/entities/student.entity";
import { StudentContact } from "../student/entities/studentContact.entity";
import { StudentAddress } from "../student/entities/studentAddress.entity";
import { User } from "../user/authentication/entities/authentication.entity";
import { AuthenticationModule } from "../user/authentication/authentication.module"; // Ensure this path is correct

@Module({
    imports:[
        TypeOrmModule.forFeature([
            Parent,
            User,
            Student,
        ]),
        AuthenticationModule
    ],
    controllers:[ParentController],
    providers:[ParentService]
})
export class ParentModule{}