import { UpdateManyResponse, Filter } from '@nestjs-query/core';
import { CRUDResolver, FilterType, UpdateManyResponseType } from '@nestjs-query/query-graphql';
import { Resolver, Args, Mutation, ID, ResolveField, Parent } from '@nestjs/graphql';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { User } from '../models/user.model';
import { UserCrudService } from '../providers/user-crud.service';

@Resolver(() => User)
export class UserCrudResolver extends CRUDResolver(User, {
    CreateDTOClass: CreateUserInput,
    UpdateDTOClass: UpdateUserInput,
}) {
    constructor(readonly service: UserCrudService) {
        super(service);
    }

    // restore one mutation will update the `deletedAt` column to null.
    @Mutation(() => User)
    restoreOneUser(@Args('input', { type: () => ID }) id: number): Promise<User> {
        return this.service.restoreOne(id);
    }

    // restore many mutation will update the `deletedAt` column to null for all todo items that
    // match the filter.
    @Mutation(() => UpdateManyResponseType())
    restoreManyUsers(
        @Args('input', { type: () => FilterType(User) }) filter: Filter<User>,
    ): Promise<UpdateManyResponse> {
        return this.service.restoreMany(filter);
    }

    @ResolveField(() => Boolean)
    passwordChangeRequired(@Parent() user: User) {

        return this.service.passwordChangeRequired(user);
    }
}
