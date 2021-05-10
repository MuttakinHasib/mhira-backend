import { SortDirection } from '@nestjs-query/core';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Module } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';
import { UsePermission } from '../permission/decorators/permission.decorator';
import { PermissionEnum } from '../permission/enums/permission.enum';
import { PermissionGuard } from '../permission/guards/permission.guard';
import { CreatePatientInput } from './dto/create-patient.input';
import { UpdatePatientInput } from './dto/update-patient.input';
import { EmergencyContact } from './models/emergency-contact.model';
import { Informant } from './models/informant.model';
import { PatientStatus } from './models/patient-status.model';
import { Patient } from './models/patient.model';
import { CaseManagerService } from './providers/case-manager.service';
import { CaseManagerResolver } from './resolvers/case-manager.resolver';
import { PatientResolver } from './resolvers/patient.resolver';

const guards = [GqlAuthGuard, PermissionGuard];
@Module({
    imports: [
        NestjsQueryGraphQLModule.forFeature({
            // import the NestjsQueryTypeOrmModule to register the entity with typeorm
            // and provide a QueryService
            imports: [NestjsQueryTypeOrmModule.forFeature([
                Patient,
                Informant,
                EmergencyContact,
                PatientStatus,
            ])],
            // describe the resolvers you want to expose
            resolvers: [
                {
                    DTOClass: Patient,
                    EntityClass: Patient,
                    CreateDTOClass: CreatePatientInput,
                    UpdateDTOClass: UpdatePatientInput,
                    guards: guards,
                    read: {
                        disabled: true,
                        defaultSort: [{ field: 'id', direction: SortDirection.DESC }],
                        decorators: [UsePermission(PermissionEnum.VIEW_PATIENTS)],
                    },
                    create: { decorators: [UsePermission(PermissionEnum.MANAGE_PATIENTS)] },
                    update: {
                        disabled: true,
                        decorators: [UsePermission(PermissionEnum.MANAGE_PATIENTS)]
                    },
                    delete: {
                        disabled: true,
                        decorators: [UsePermission(PermissionEnum.DELETE_PATIENTS)]
                    },
                },
                {
                    DTOClass: Informant,
                    EntityClass: Informant,
                    guards: guards,
                    read: {
                        defaultSort: [{ field: 'id', direction: SortDirection.DESC }],
                        decorators: [UsePermission(PermissionEnum.VIEW_PATIENTS)],
                    },
                    create: { decorators: [UsePermission(PermissionEnum.MANAGE_PATIENTS)] },
                    update: { decorators: [UsePermission(PermissionEnum.MANAGE_PATIENTS)] },
                    delete: { decorators: [UsePermission(PermissionEnum.MANAGE_PATIENTS)] },
                },
                {
                    DTOClass: EmergencyContact,
                    EntityClass: EmergencyContact,
                    guards: guards,
                    read: {
                        defaultSort: [{ field: 'id', direction: SortDirection.DESC }],
                        decorators: [UsePermission(PermissionEnum.VIEW_PATIENTS)],
                    },
                    create: { decorators: [UsePermission(PermissionEnum.MANAGE_PATIENTS)] },
                    update: { decorators: [UsePermission(PermissionEnum.MANAGE_PATIENTS)] },
                    delete: { decorators: [UsePermission(PermissionEnum.MANAGE_PATIENTS)] },
                },
                {
                    DTOClass: PatientStatus,
                    EntityClass: PatientStatus,
                    guards: guards,
                    read: {
                        defaultSort: [{ field: 'id', direction: SortDirection.DESC }],
                    },
                    create: { decorators: [UsePermission(PermissionEnum.MANAGE_SETTINGS)] },
                    update: { decorators: [UsePermission(PermissionEnum.MANAGE_SETTINGS)] },
                    delete: { decorators: [UsePermission(PermissionEnum.MANAGE_SETTINGS)] },
                },
            ],
        }),
    ],
    providers: [
        CaseManagerService,
        CaseManagerResolver,
        PatientResolver,
    ],
})
export class PatientModule { }
