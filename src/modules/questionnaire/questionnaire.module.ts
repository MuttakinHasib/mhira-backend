import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GqlAuthGuard } from '../auth/auth.guard';
import { Answer, AnswerSchema } from './models/answer.schema';
import {
    QuestionGroup,
    QuestionGroupSchema,
} from './models/question-group.schema';
import {
    Choice,
    ChoiceSchema,
    Question,
    QuestionSchema,
} from './models/question.schema';
import {
    QuestionnaireVersion,
    QuestionnaireVersionSchema,
} from './models/questionnaire-version.schema';
import { QuestionnaireService } from './services/questionnaire.service';
import { QuestionnaireResolver } from './resolvers/questionnaire.resolver';
import {
    Questionnaire,
    QuestionnaireSchema,
} from './models/questionnaire.schema';

const guards = [GqlAuthGuard];
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Questionnaire.name, schema: QuestionnaireSchema },
            {
                name: QuestionnaireVersion.name,
                schema: QuestionnaireVersionSchema,
            },
            { name: Question.name, schema: QuestionSchema },
            { name: QuestionGroup.name, schema: QuestionGroupSchema },
            { name: Answer.name, schema: AnswerSchema },
            { name: Choice.name, schema: ChoiceSchema },
        ]),
    ],
    providers: [QuestionnaireService, QuestionnaireResolver],
})
export class QuestionnaireModule {}
