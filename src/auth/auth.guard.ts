import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/decorators/skipAuth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      // 💡 See this condition
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const authToken = this.extrackTokenFromHeader(request);

    if (!authToken) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(authToken, {
        secret: this.configService.get('JWT_SECRET'),
      });

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  // token在header 中token的格式： Bearer XXXXXX

  private extrackTokenFromHeader(req: Request): string | undefined {
    const [authType, authToken] = req.headers?.authorization?.split(' ') ?? [
      undefined,
      undefined,
    ];
    const token = authType === 'Bearer' ? authToken : undefined;

    return token;
  }
}
