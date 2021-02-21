import { Entity, ObjectIdColumn, Column } from "typeorm";
import { ObjectId } from "mongodb";

@Entity()
export class User {
    @ObjectIdColumn()
    _id: ObjectId;
    @Column()
    username: string;
    @Column()
    password: string;
    @Column()
    name: string;
    @Column()
    avatarUrl: string;
    @Column()
    googleId: string;
    @Column()
    facebookId: string;
    @Column()
    githubId: string;
    @Column()
    elo: number;
    @Column()
    createDate: Date = new Date();
}
