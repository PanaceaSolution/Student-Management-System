import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'fees' })
export class Finance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  registrationFee: string;

  @Column({ type: 'text', nullable: false })
  examinationFee: string;

  @Column({ type: 'text', nullable: false })
  admissionFee: string;

  @Column({ type: 'text', nullable: false })
  securityDeposite: string;

  @Column({ type: 'text', nullable: false })
  otherCharges: string;

  @Column({ type: 'text', nullable: false })
  anualFee: string;

  @Column({ type: 'text', nullable: false })
  monthlyFee: string;

  @Column({ type: 'text', default: '0', nullable: false })
  discount: string;

  @Column({ type: 'text', default: '0', nullable: false })
  tax: string;

  @Column({ type: 'text', default: '0', nullable: false })
  extraCharges: string;

  @Column({ type: 'text', default: '0', nullable: false })
  total: string;

  @Column({ type: 'text', default: '0', nullable: false })
  amountInWords: string;

  @Column({ type: 'text', nullable: true })
  agreementFile: string;

  @Column({ type: 'text', nullable: true })
  discritpion: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
