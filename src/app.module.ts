import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { User2Module } from './user2/user2.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver, // Thêm driver vào đây
      autoSchemaFile: 'schema.gql',
      debug: true, // Bật debug mode
      introspection: true,
      playground: true,
      csrfPrevention: false, // Tắt CSRF protection
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
    }),
    AuthModule,
    UserModule,
    BookmarkModule,
    PrismaModule,
    User2Module,
  ],
})
export class AppModule {}
