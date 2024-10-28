import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Parent } from '../../parent/entities/parent.entity';

@Entity({ name: 'students' })
export class Student {
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
  bloodType: string;

  @Column({ type: 'text', nullable: false })
  gender: string;

  @Column({ type: 'date', nullable: false })
  dateOfBirth: Date;

  // Father and Mother fields are now optional
  @Column({ type: 'text', nullable: true })
  fatherName?: string;

  @Column({ type: 'text', nullable: true })
  motherName?: string;

  @Column({ type: 'text', nullable: false })
  class: string;

  @Column({ type: 'text', nullable: false })
  section: string;

  @Column({ type: 'text', nullable: false })
  registrationNumber: string;

  @Column({ type: 'simple-array', nullable: false })
  documents: string[];

  //Many to one relationship
  @ManyToOne(() => Parent, (parent) => parent.children, { nullable: true })
  parent?: Parent;

  //phone number field if a student has no parent
  @Column({ type: 'text', nullable: true })
  phoneNumber?: string;

  @Column({ type: 'text', nullable: true })
  alternatePhoneNumber?: string;

  @Column({ type: 'text', nullable: true })
  telephoneNumber?: string;

  // inherited values phone number
  get phoneNumberInherited(): string | null {
    return this.parent ? this.parent.phoneNumber : this.phoneNumber || null;
  }

  get alternatePhoneNumberInherited(): string | null {
    return this.parent
      ? this.parent.alternatePhoneNumber
      : this.alternatePhoneNumber || null;
  }

  get telephoneNumberInherited(): string | null {
    return this.parent
      ? this.parent.telephoneNumber
      : this.telephoneNumber || null;
  }

  // Address fields for students with no parent
  @Column({ type: 'text', nullable: true })
  permanentWardNumber?: string;

  @Column({ type: 'text', nullable: true })
  permanentMunicipality?: string;

  @Column({ type: 'text', nullable: true })
  permanentDistrict?: string;

  @Column({ type: 'text', nullable: true })
  permanentProvince?: string;

  @Column({ type: 'text', nullable: true })
  permanentCountry?: string;

  @Column({ type: 'text', nullable: true })
  permanentPostalCode?: string;

  // Virtual properties for inherited values (addresses)
  get permanentWardNumberInherited(): string | null {
    return this.parent
      ? this.parent.permanentWardNumber
      : this.permanentWardNumber || null;
  }

  get permanentMunicipalityInherited(): string | null {
    return this.parent
      ? this.parent.permanentMunicipality
      : this.permanentMunicipality || null;
  }

  get permanentDistrictInherited(): string | null {
    return this.parent
      ? this.parent.permanentDistrict
      : this.permanentDistrict || null;
  }

  get permanentProvinceInherited(): string | null {
    return this.parent
      ? this.parent.permanentProvince
      : this.permanentProvince || null;
  }

  get permanentCountryInherited(): string | null {
    return this.parent
      ? this.parent.permanentCountry
      : this.permanentCountry || null;
  }

  get permanentPostalCodeInherited(): string | null {
    return this.parent
      ? this.parent.permanentPostalCode
      : this.permanentPostalCode || null;
  }

  get religionInherited(): string | null {
    return this.parent ? this.parent.religion : null;
  }
}
