import { Body, Controller,Get,Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Get('home')
    home(){
        return 'THis is homePage';
    }

    @Post('signup')
    signUp(@Body() dto: any){
        return this.authService.signup();
    }

    @Post('signin')
    signIn(){
        return this.authService.signin();
    }
}
