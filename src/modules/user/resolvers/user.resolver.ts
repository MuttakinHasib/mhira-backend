import { Resolver, Args, Query, Mutation, Int } from '@nestjs/graphql';
import { User } from '../models/user.model';
import { UserService } from '../providers/user.service';
import { UserUpdateInput } from '../dto/user-update.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/modules/auth/auth.guard';
import { UserUpdatePasswordInput } from '../dto/user-update-password.dto';
import { UserInput } from '../dto/user.input';
import { UserConnection } from '../dto/user-connection.model';
import { UserFilter } from '../dto/user.filter';
import { PaginationArgs } from 'src/shared/pagination/types/pagination.args';

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UserResolver {
    constructor(
        private readonly userService: UserService,
    ) { }

    @Query(() => UserConnection)
    getUsers(
        @Args() paginationArgs: PaginationArgs,
        @Args() userFilter: UserFilter,
    ): Promise<UserConnection> {
        return this.userService.listUsers(paginationArgs, userFilter);
    }

    @Mutation(() => User)
    createUser(
        @Args('input') userInput: UserInput,
    ): Promise<User> {
        return this.userService.createUser(userInput);
    }

    @Mutation(() => User)
    updateUser(
        @Args({ name: 'id', type: () => Int }) userId: number,
        @Args('input') userInputData: UserUpdateInput,
    ): Promise<User> {
        return this.userService.updateUser(userId, userInputData);
    }

    @Mutation(() => Boolean)
    deleteUser(
        @Args('id') id: number,
    ): Promise<boolean> {
        return this.userService.deleteUser(id);
    }

    @Mutation(() => Boolean)
    updateUserPassword(
        @Args({ name: 'id', type: () => Int }) targetUserId: number,
        @Args('input') updatePasswordInput: UserUpdatePasswordInput,
    ): Promise<boolean> {
        return this.userService.changePassword(updatePasswordInput, targetUserId);
    }
}
