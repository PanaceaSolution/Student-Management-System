export class CreateStudentDto {
  userName: string;
  fname: string;
  lname: string;
  email: string;
  bloodType: string;
  gender: string;
  dateOfBirth: Date;
  fatherName?: string;
  motherName?: string;
  class: string;
  section: string;
  registrationNumber: string;
  documents: string[];
  parentId?: string;
  phoneNumber?: string;
  alternatePhoneNumber?: string;
  telephoneNumber?: string;
  permanentWardNumber?: string;
  permanentMunicipality?: string;
  permanentDistrict?: string;
  permanentProvince?: string;
  permanentCountry?: string;
  permanentPostalCode?: string;
}
