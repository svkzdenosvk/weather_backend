import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyShortToken } from 'src/lib/jwt/jwt_helper';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    // from cookie instead of Authorization header
    const token = request.cookies?.shortTerm_token;

    if (!token) throw new UnauthorizedException();

    try {
      const payload = verifyShortToken(token);
      if (!payload) throw new UnauthorizedException();
      // request.user = payload;
      request.user = { sub: payload.id, username: payload.username };

      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}

