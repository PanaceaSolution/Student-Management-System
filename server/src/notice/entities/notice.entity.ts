import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('notices')
export class Notice {
    @PrimaryGeneratedColumn('uuid')
    noticeID: string;

    @Column({type : 'text'})
    title: string;

    @Column ({type : 'text'})
    description: string;

    @Column ({nullable: true})
    filePath: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

}
