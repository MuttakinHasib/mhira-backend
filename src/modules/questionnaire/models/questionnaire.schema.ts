import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { QuestionnaireVersion } from './questionnaire-version.schema';

@ObjectType()
@Schema()
export class Questionnaire extends Document {
    @Field(() => String)
    _id: Types.ObjectId;

    @Field(() => [String])
    @Prop({
        type: [Types.ObjectId],
        ref: QuestionnaireVersion.name,
    })
    versions: Types.ObjectId[] = [];

    @Field(() => String)
    @Prop()
    language: string;

    @Field(() => String)
    @Prop()
    abbreviation: string;

    @Field(() => Date)
    @Prop()
    createdAt: Date;

    // TODO: filter newest questionnaire version to copy and use ...
}

export const QuestionnaireSchema = SchemaFactory.createForClass(
    Questionnaire,
).index({ language: 1, abbreviation: 1 }, { unique: true }); // index to ensure that translations for the same questionnaire can be uploaded
