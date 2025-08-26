import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserResponse } from './userResponse.dto';

@ObjectType()
export class UsersPagination {
    @Field(() => Int)
    totalUser: number;

    @Field(() => Int)
    totalPage: number;

    @Field(() => [UserResponse], { nullable: true })
    items?: UserResponse[] | null;
}
