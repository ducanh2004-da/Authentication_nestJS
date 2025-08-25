import { Module } from '@nestjs/common';
import { User2Resolver } from './user2.resolver';
import { User2Service } from './user2.service';

@Module({
  providers: [User2Resolver, User2Service]
})
export class User2Module {}
