import { Filter } from '@nestjs-query/core';
import { Patient } from "../models/patient.model";
import { User } from "src/modules/user/models/user.model";
import { PermissionService } from 'src/modules/permission/providers/permission.service';
import { PermissionEnum } from 'src/modules/permission/enums/permission.enum';

export class PatientAuthorizer {

    /**
     * Returns a filter of the Patients Query,
     * By the current user id's departments.
     * 
     * @param userId 
     * @returns 
     */
    static async authorizePatient(userId: number): Promise<Filter<Patient>> {

        // Reload current user with departments
        const currentUser = await User.findOne({
            where: { id: userId },
            relations: ['departments'],
        });

        if (await PermissionService.userCan(currentUser.id, PermissionEnum.VIEW_ALL_PATIENTS)) {
            return {};
        }

        const deparmentIds = currentUser.departments.map((department) => department.id);

        // User has no departments
        if (deparmentIds.length < 1) {

            return Promise.resolve(
                { departments: { id: { is: null } } } // include patients without a department
            );
        }

        return Promise.resolve({
            or: [
                { departments: { id: { in: deparmentIds } } },
                { departments: { id: { is: null } } }
            ]
        });
    }

}
