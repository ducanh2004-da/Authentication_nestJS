import {IsEmail,IsNotEmpty,IsOptional,IsString} from 'class-validator';
export class UserDto{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    password: string;

    @IsOptional()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsString()
    lastName: string;
}