import type { Relation } from 'typeorm';

import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity.js';

@Entity({ name: 'UserType' })
export class UserType extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @Column({ type: 'varchar', length: 24 })
    cod!: string;

    @OneToMany(_ => User, r => r.userType)
    users?: Relation<User[]>;
}