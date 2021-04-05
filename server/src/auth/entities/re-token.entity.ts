import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ReToken {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column({ nullable: false })
      data: string;

      @Column({ nullable: false })
      userId: string;
}
