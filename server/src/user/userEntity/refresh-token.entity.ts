import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../authentication/entities/authentication.entity';

@Entity('refreshTokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column()
  refreshToken: string;

  @Column()
  expiresAt: Date;

  @Column({ type:"simple-array",nullable: true }) 
deviceInfo: Array<string>;

@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
lastUsedAt: Date;
}
