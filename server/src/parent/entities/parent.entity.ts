import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

import { UUID } from "typeorm/driver/mongodb/bson.typings";

import { Student } from "../../student/entities/student.entity";
import { GENDER } from "../../utils/role.helper";

@Entity({name:"Parent"})
export class Parent {
    @PrimaryGeneratedColumn('uuid')
    parentId : UUID;

    @Column({type:'text', nullable:false})
    fname:string;

    @Column({type:'text', nullable:false})
    lname:string;

    @Column({type:'text', nullable:false , unique:true})
    email:string;
 
    @Column({type:'text', nullable:false})
    gender: GENDER

    @Column({type:'text', nullable:true, unique:true})
    username:string;

    @Column({type:'text', nullable:true})
    password:string;

    @Column({type:'text', nullable:true})
    profilePicture:string;

    @OneToMany(()=> Student, student =>student.parent)
    students: Student[];
 
}