import { Field, ObjectType } from '@nestjs/graphql';

// Bỏ aiId khỏi response nếu không cần hiển thị
@ObjectType()
export class UserResponse {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;
}
