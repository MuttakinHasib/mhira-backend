import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
} from '@nestjs/common';
import { User } from '../models/user.model';
import { Hash } from 'src/shared/helpers/hash.helper';
import * as moment from 'moment';
import { UserPreviousPassword } from '../models/user-previous-password.model';
import { SettingService } from 'src/modules/setting/providers/setting.service';
import { ChangeOwnPasswordInput } from '../dto/change-own-password.input';
import { ChangePasswordInput } from '../dto/change-password.input';

@Injectable()
export class ChangePasswordService {

    constructor(
        private readonly setting: SettingService,
    ) { }

    async changeOwnPassword(input: ChangeOwnPasswordInput, user: User): Promise<boolean> {

        const validateCurrentPassword = await Hash.compare(input.currentPassword, user.password);

        // validate current password
        if (!validateCurrentPassword) {
            throw new UnauthorizedException('Invalid current password provided!');
        }

        // Validate new password differ from old password
        if (input.newPassword === input.currentPassword) {
            throw new BadRequestException('New password cannot be same as previous password!');
        }

        // Delegate to other operations changePasswordCore
        return this.changePasswordCore(input, user);

    }

    async changeOtherUserPassword(input: ChangePasswordInput, targetUserId: number): Promise<boolean> {

        const targetUser = await User.findOneOrFail(targetUserId);

        // Delegate to other operations changePasswordCore
        return this.changePasswordCore(input, targetUser);
    }

    protected async changePasswordCore(input: ChangePasswordInput, targetUser: User): Promise<boolean> {

        /**
         * Validate password complexity:
         * 1 lowercase
         * 1 uppercase
         * 1 character
         * atleast 8 characters long
         */
        const complexity = new RegExp(/^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+*!=]).*$/);

        const isStrongPassword = typeof input.newPassword === 'string' && input.newPassword.match(complexity);

        if (!isStrongPassword) {
            throw new BadRequestException(
                'Password must be atleast 8 characters long and'
                + ' contain 1 lowercase, 1 uppercase, 1 numeric,'
                + ' and one special character'
            );
        }

        /**
         * Validate password confirmation
         */
        if (input.newPassword !== input.newPasswordConfirmation) {
            throw new BadRequestException(
                'Password confirmation mismatch!'
                + ' Provided password and password confirmation did not match.'
            );
        }

        /**
         * Validate Password not used within last X days
         */
        const cutOffDays = await this.setting.getKey('passwordReUseCutoffInDays');
        const cutOffDate = moment().subtract(cutOffDays, 'days').format('YYYY-MM-DD');

        const prevPasswords = await UserPreviousPassword
            .createQueryBuilder('passwords')
            .where(
                'passwords.userId = :userId and passwords.createdAt >= :cutOffDate',
                { userId: targetUser.id, cutOffDate }
            )
            .getMany();

        for (const prevPassword of prevPasswords) {
            const isSamePassword = await Hash.compare(input.newPassword, prevPassword.password);

            // throw exception if password recently used
            if (isSamePassword) {
                throw new BadRequestException(`Password was once used in the last ${cutOffDays} days! Please enter another password!`);
            }
        }

        /**
         * Save last password in previous passwords
         */
        await UserPreviousPassword.insert({
            password: targetUser.password,
            userId: targetUser.id,
        });

        // Update new password 
        const hashedPassword = await Hash.make(input.newPassword);
        targetUser.password = hashedPassword;

        // Set expiry date for new password
        const passwordLifeTime = await this.setting.getKey('passwordLifeTimeInDays');

        const passwordExpiresAt = input.requirePasswordChangeOnLogin
            ? moment().toDate()
            : moment().add(passwordLifeTime, 'days').toDate();


        // save password
        targetUser.passwordExpiresAt = passwordExpiresAt;
        await targetUser.save();

        return true;
    }

}