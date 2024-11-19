import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../authentication/entities/authentication.entity';

@Entity('refresh_tokens')
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

  @Column({ nullable: true })
deviceInfo: string;

@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
lastUsedAt: Date;
}
