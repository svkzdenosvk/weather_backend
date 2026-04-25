import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }

    const token = authHeader.split(' ')[1];

    // console.log('TOKEN:', token);

    try {
      //   const payload = this.jwtService.verify(token, {
      //     secret: process.env.JWT_SECRET ?? 'supersecret',
      //   });
      //   console.log('PAYLOAD:', payload);
      const payload = this.jwtService.verify(token);

      request.user = payload;
      return true;
    } catch (error) {
      // console.log('ERROR:', error instanceof Error ? error.message : error);

      throw new UnauthorizedException();
    }
  }
}
