import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { UserResponse } from '../models/userResponse.dto';
import { User2Service } from './user2.service';
import { CreateUserInput } from '../models/create-user.dto';

@Resolver(() => UserResponse)
export class User2Resolver {
    constructor(private userService: User2Service){}

    @Query(()=> [UserResponse], {name: 'users'})
    async findAll(){
        return this.userService.findAll();
    }

    @Query(() => UserResponse, {name: 'userItem', nullable: true})
    async findOne(@Args('id', {type: () => Number}) id: number){
        return this.userService.findOne(id);
    }
    @Mutation(()=> UserResponse)
    async addUser(@Args('data') data: CreateUserInput){
        return this.userService.add(data)
    }

    @Mutation(()=> UserResponse)
    async editUser(@Args('id', {type: () => Number}) id: number, @Args('data') data: CreateUserInput){
        return this.userService.edit(id, data);
    }

    @Mutation(()=> UserResponse)
    async deleteUser(@Args('id', {type: () => Number}) id: number){
        return this.userService.delete(id);
    }
}
