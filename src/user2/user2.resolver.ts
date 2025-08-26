import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { UserResponse } from '../models/userResponse.dto';
import { User2Service } from './user2.service';
import { CreateUserInput } from '../models/create-user.dto';
import { UsersPagination } from '../models/userPagination.dto'

@Resolver(() => UserResponse)
export class User2Resolver {
    constructor(private userService: User2Service) { }

    @Query(() => UsersPagination, { name: 'users' })
    async findAll() {
        const PageSize = 5;
        const CurrentPage = 1;
        const result = this.userService.findAll(PageSize, CurrentPage);
        return result;
    }

    @Query(() => UserResponse, { name: 'userItem', nullable: true })
    async findOne(@Args('id', { type: () => Number }) id: number) {
        return this.userService.findOne(id);
    }
    @Mutation(() => UserResponse)
    async addUser(@Args('data') data: CreateUserInput) {
        return this.userService.add(data)
    }

    @Mutation(() => UserResponse)
    async editUser(@Args('id', { type: () => Number }) id: number, @Args('data') data: CreateUserInput) {
        return this.userService.edit(id, data);
    }

    @Mutation(() => UserResponse)
    async deleteUser(@Args('id', { type: () => Number }) id: number) {
        return this.userService.delete(id);
    }
    @Mutation(() => UsersPagination)
    async search(@Args('email', { type: () => String }) email: string) {
        const PageSize = 5;
        const CurrentPage = 1;
        const result = this.userService.findByEmail(PageSize, CurrentPage, email);
        return result;
    }
}
