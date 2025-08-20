import { Body, Controller,Get,Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from '../models/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Get('home')
    home(){
        return 'THis is homePage';
    }

    @Post('signup')
    signUp(@Body() dto: AuthDto){
        console.log({dto});
        return this.authService.signup(dto);
    }

    @Post('signin')
    signIn(@Body() dto: AuthDto){
        return this.authService.signin(dto);
    }
}
