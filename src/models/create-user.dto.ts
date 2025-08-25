// src/auth/dto/create-user.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

@InputType()
export class CreateUserInput {
    @Field()
    @IsEmail()
    email: string;

    @Field()
    @IsString()
    @MinLength(6)
    password: string;

    // thêm các field khác nếu cần
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    firstName: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    lastName: string;
}
