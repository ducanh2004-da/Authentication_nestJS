import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator/getUser.decorator';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { UserDto } from '../models/user.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}
    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getMe(@GetUser() user: User) {
        return user;
    }

    @Get('all')
    getAll(){
        return this.userService.viewData();
    }

    @Get(':id')
    GetOne(@GetUser('id') accountId: number, @Param('id',ParseIntPipe) userId:number){
        return this.userService.findOne(userId);
    }

    @Post('add')
    addUser(@Body() dto:UserDto){
        return this.userService.add(dto);
    }

    @Put(':id')
    editUser(@GetUser('id') accountId: number , @Param('id',ParseIntPipe) userId:number,  @Body() dto: UserDto){
        return this.userService.edit(userId,dto);
    }

    @Delete(':id')
    deleteUser(@GetUser('id') accountId: number , @Param('id',ParseIntPipe) userId:number, dto: UserDto){
        return this.userService.delete(userId, dto);
    }
}
