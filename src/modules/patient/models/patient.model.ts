import { FilterableField, Relation } from "@nestjs-query/query-graphql";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Assessment } from "src/modules/assessment/models/assessment.model";
import { Department } from "src/modules/department/models/department.model";
import { Country } from "src/modules/lists/models/country.model";
import { User } from "src/modules/user/models/user.model";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EmergencyContact } from "./emergency-contact.model";
import { GenderEnum } from "./gender.enum";
import { Informant } from "./informant.model";

@ObjectType()
@Relation('caseManagers', () => [User], { nullable: true, disableUpdate: true })
@Relation('informants', () => [Informant], { nullable: true, disableUpdate: true })
@Relation('emergencyContacts', () => [EmergencyContact], { nullable: true, disableUpdate: true })
@Relation('country', () => Country, { nullable: true, disableUpdate: true, disableRemove: true })
@Entity()
export class Patient extends BaseEntity {

    static searchable = [
        'medicalRecordNo',
        'firstName',
        'middleName',
        'lastName',
        'phone',
        'email',
        'address',
    ];

    @FilterableField(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @FilterableField()
    @Column({ default: true })
    active: boolean;

    @FilterableField({ nullable: true })
    @Column({ nullable: true, unique: true })
    medicalRecordNo: string;

    @FilterableField()
    @Column()
    firstName: string;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    middleName: string;

    @FilterableField()
    @Column()
    lastName: string;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    phone: string;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    phone2: string;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    email: string;

    @FilterableField({ nullable: true, deprecationReason: 'Replaced with address subfields' })
    @Column({ nullable: true })
    address: string;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    addressStreet: string;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    addressNumber: string;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    addressApartment: string;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    addressPlace: string;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    addressPostalCode: string;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    addressCountryId: number;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    gender: GenderEnum;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    birthDate: Date;

    @FilterableField({ nullable: true })
    @Column({ type: 'char', length: 2, nullable: true })
    birthCountryCode: string;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    nationality: string;

    @FilterableField()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    @Field({ nullable: true })
    @DeleteDateColumn()
    deletedAt?: Date;

    @ManyToMany(() => User, user => user.patients)
    @JoinTable({ name: 'patient_case_manager' })
    caseManagers: User[];

    @ManyToMany(() => Department, department => department.patients)
    @JoinTable({ name: 'patient_department' })
    departments: Department[];

    @OneToMany(() => Informant, informant => informant.patient)
    informants: Informant[];

    @OneToMany(() => EmergencyContact, contact => contact.patient)
    emergencyContacts: EmergencyContact[];

    @OneToMany(() => Assessment, (assessment) => assessment.patient)
    assessments: Assessment;

    @ManyToOne(() => Country)
    country: Country;

}
