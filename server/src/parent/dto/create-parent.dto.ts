export class CreateParentDto {
  userName: string;
  fname: string;
  lname: string;
  email: string;
  gender: string;
  phoneNumber: string;
  alternatePhoneNumber?: string;
  telephoneNumber?: string;
  permanentWardNumber: string;
  permanentMunicipality: string;
  permanentDistrict: string;
  permanentProvince: string;
  permanentCountry: string;
  permanentPostalCode: string;
  temporaryWardNumber?: string;
  temporaryMunicipality?: string;
  temporaryDistrict?: string;
  temporaryProvince?: string;
  temporaryCountry?: string;
  temporaryPostalCode?: string;
  religion: string;
}
