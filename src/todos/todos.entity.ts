import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { File } from "./files.entity";
// import { v4 as uuid} from 'uuid';

@Entity({
    name: 'todos',
})
export class Todo {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    title: string;
    
    @Column()
    description: string;
    
    @Column({ default: false })
    isCompleted: boolean;

    @OneToMany(() => File, (file) => file.todo)
    files: File[];
}