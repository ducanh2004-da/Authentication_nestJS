import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from 'src/models';
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ) { }
    async home(){
        const user = await this.prisma.user.findFirst({
            where:{
                email: "anhdo12345@gmail.com"
            },
        });
        return user;
    }
    async signin(dto: AuthDto) {
        //find user by email
        const user = await this.prisma.user.findFirst({
            where: {
                email: dto.email,
            },
        });
        //if not exist throw execption
        if(!user){
            throw new ForbiddenException('User not exist');
        }
        //compare password
        const checkPwt = await argon.verify(user.password,dto.password);
        //if password incorrect throw exception
        if(!checkPwt){
            throw new ForbiddenException('Password not correct')
        }

        //send back user
        return this.signToken(user.id, user.email);
    }
    async signup(dto: AuthDto) {
        // create hash
        try {
            const hash = await argon.hash(dto.password);
            //save in db
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password: hash
                },
                select: {
                    id: true,
                    email: true,
                    password: true
                }
            });
            //return data
            return this.signToken(user.id, user.email);
        }
        catch(err){
            //nếu lỗi của prisma
            if(err instanceof PrismaClientKnownRequestError){
                //nếu lỗi lặp giá trị
                if(err.code === 'P2002'){
                    throw new ForbiddenException('Credentials taken');
                }
            }
            throw err;
        }
    }
    async signToken(userId: number, email: string){
        //create payload contain data to put in JWT
        const payload = {
            sub: userId,
            email
        }
        // secret key from env
        const secret = this.config.get('SECRET_KEY');
        // make jwt depend on payload, put expiresIn and secret
        const token = await this.jwt.signAsync(payload)
        return {
            access_token: token,

        }
    }
}
