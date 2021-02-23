import { ObjectId } from "mongodb";
import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity()
export class AuthToken {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    data: any;
}