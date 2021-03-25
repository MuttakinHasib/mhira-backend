import { Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { GenderEnum } from '../models/gender.enum';

@InputType()
export class CreatePatientInput {
    @Field({ defaultValue: true })
    active: boolean;

    @Field({ nullable: true })
    statusId: number;

    @Field({ nullable: true })
    medicalRecordNo: string;

    @Field()
    firstName: string;

    @Field({ nullable: true })
    middleName: string;

    @Field()
    lastName: string;

    @Field({ nullable: true })
    phone: string;

    @Field({ nullable: true })
    phone2: string;

    @Field({ nullable: true })
    email: string;

    @Field({ nullable: true })
    address: string;

    @Field({ nullable: true })
    gender: GenderEnum;

    @Field({ nullable: true })
    birthDate: Date;

    @Field({ nullable: true })
    @MaxLength(2)
    birthCountryCode: string;

    @Field({ nullable: true })
    nationality: string;

    @Field({ nullable: true })
    addressStreet: string;

    @Field({ nullable: true })
    addressNumber: string;

    @Field({ nullable: true })
    addressApartment: string;

    @Field({ nullable: true })
    addressPlace: string;

    @Field({ nullable: true })
    addressPostalCode: string;

    @Field({ nullable: true })
    @MaxLength(2)
    addressCountryCode: string;
}
