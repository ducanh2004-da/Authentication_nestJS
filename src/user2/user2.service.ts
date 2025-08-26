import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { UserDto } from '../models/user.dto';
import { contains } from 'class-validator';

@Injectable()
export class User2Service {
    constructor(private prisma: PrismaService) { }

    async findAll(PageSize: number, CurrentPage: number) {
        const [totalUser, user] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.findMany({
                skip: (CurrentPage - 1)*PageSize,
                take: PageSize,
                orderBy: { createdAt: 'desc' }, 
            }),
        ]);
        const totalPages = Math.max(1, Math.ceil(totalUser / PageSize));
        return {
            totalUser: totalUser,
            totalPage: totalPages,
            items: user
        }
    }

    async findOne(userId: number) {
        const user = this.prisma.user.findFirst({
            where: {
                id: userId,
            }
        })
        if (!user) {
            throw new BadRequestException(`User not exists`)
        }
        return user;
    }
    async findByEmail(PageSize: number, CurrentPage: number, email: string){
        const [totalUser, user] = await Promise.all([
            this.prisma.user.count({where: email ? {email:{contains: email, mode: 'insensitive'}} : {}}),
            this.prisma.user.findMany({
                where: email ? {email:{contains: email, mode: 'insensitive'}} : {},
                skip: (CurrentPage - 1)*PageSize,
                take: PageSize,
                orderBy: { createdAt: 'desc' }, 
            }),
        ]);
        const totalPages = Math.max(1, Math.ceil(totalUser / PageSize));
        return {
            totalUser: totalUser,
            totalPage: totalPages,
            items: user
        }
    }
    async add(dto: UserDto) {
        const isRepeat = await this.prisma.user.findFirst({
            where: {
                email: dto.email
            }
        })
        if (isRepeat) {
            throw new BadRequestException(`Title '${dto.email}' already exists`)
        }
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                firstName: dto.firstName,
                lastName: dto.lastName,
                password: dto.password
            }
        })
        return user;
    }
    async edit(userId: number, dto: UserDto) {
        const findUser = await this.prisma.user.findFirst({
            where: {
                id: userId
            }
        })
        if (!findUser) {
            throw new BadRequestException(`User is not exists`);
        }
        const editUser = await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                ...dto
            }
        })
        return editUser;
    }
    async delete(userId: number) {
        const findUser = await this.prisma.user.findFirst({
            where: {
                id: userId
            }
        })
        if (!findUser) {
            throw new BadRequestException(`User is not exists`);
        }
        const deleteUser = await this.prisma.user.delete({
            where: {
                id: userId
            }
        })
        return deleteUser;
    }
}
