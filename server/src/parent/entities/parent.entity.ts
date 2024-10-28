import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Student } from '../../student/entities/student.entity';

@Entity({ name: 'parents' })
export class Parent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false, unique: true })
  userName: string;

  @Column({ type: 'text', nullable: false })
  fname: string;

  @Column({ type: 'text', nullable: false })
  lname: string;

  @Column({ type: 'text', nullable: false })
  email: string;

  @Column({ type: 'text', nullable: false })
  gender: string;

  // Contact info
  @Column({ type: 'text', nullable: false })
  phoneNumber: string;

  @Column({ type: 'text', nullable: true })
  alternatePhoneNumber: string;

  @Column({ type: 'text', nullable: true })
  telephoneNumber: string;

  // Permanent address
  @Column({ type: 'text', nullable: false })
  permanentWardNumber: string;

  @Column({ type: 'text', nullable: false })
  permanentMunicipality: string;

  @Column({ type: 'text', nullable: false })
  permanentDistrict: string;

  @Column({ type: 'text', nullable: false })
  permanentProvince: string;

  @Column({ type: 'text', nullable: false })
  permanentCountry: string;

  @Column({ type: 'text', nullable: false })
  permanentPostalCode: string;

  // Temporary address
  @Column({ type: 'text', nullable: true })
  temporaryWardNumber: string;

  @Column({ type: 'text', nullable: true })
  temporaryMunicipality: string;

  @Column({ type: 'text', nullable: true })
  temporaryDistrict: string;

  @Column({ type: 'text', nullable: true })
  temporaryProvince: string;

  @Column({ type: 'text', nullable: true })
  temporaryCountry: string;

  @Column({ type: 'text', nullable: true })
  temporaryPostalCode: string;

  @Column({ type: 'text', nullable: false })
  religion: string;

  @OneToMany(() => Student, (student) => student.parent, { cascade: true })
  children: Student[];
}
