import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Task } from '../../tasks/entities/task.entity';

export interface IUser {
  id?: number;
  username: string;
  password: string;
  salt: string;
  tasks?: Task[];
}
@Entity()
@Unique(['username'])
export class User extends BaseEntity implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToMany(() => Task, (task) => task.user, { eager: true })
  tasks: Task[];

  constructor(user?: IUser) {
    super();
    if (user) {
      // this.id = user.id || undefined;
      this.username = user.username || undefined;
      this.password = user.password || undefined;
      this.salt = user.salt || undefined;
      // this.tasks = user.tasks || undefined;
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
