import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt') 
  {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('SECRET_KEY')!,
    });
  }

  // 👇 required by passport-jwt
  async validate(payload: {sub: number; email: string; role: string;}) {
    // payload is the decoded JWT
    // you can attach whatever you return here to req.user
    const user = await this.prisma.user.findUnique({
      where:{
        id: payload.sub
      }
    })
    if (!user) return null;
    const { password, ...result } = user;
    return result;
  }
}
