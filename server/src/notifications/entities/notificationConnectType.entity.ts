import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class NotificationConnectType {
      constructor(link: string, content: string) {
            this.link = link;
            this.content = content;
      }

      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column({ default: null })
      content: string;

      @Column({ default: null })
      link: string;
}
