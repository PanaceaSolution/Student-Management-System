export class CreateClassDto {
    className: string;
    section: string;
    routineFile?: string;
    classTeacherId: string;
    subjects: string[];
  }