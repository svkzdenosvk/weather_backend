

import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  HttpCode,
  
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  signShortToken,
  signLongToken,
  verifyShortToken,
  verifyLongToken,
} from '../lib/jwt/jwt_helper';

const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ('none' as const) : ('lax' as const),
  path: '/',
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(dto.username, dto.password);

    const shortToken = signShortToken(user.id, user.username);
    const longToken = signLongToken(user.id);

    res.cookie('shortTerm_token', shortToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('longTerm_token', longToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      user: { id: user.id, username: user.username, role: user.role },
    };
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.username, dto.password);
  }

  @Get('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('shortTerm_token', { ...cookieOptions, expires: new Date(0) });
    res.clearCookie('longTerm_token', { ...cookieOptions, expires: new Date(0) });
    return { success: true };
  }

  @Get('me')
  async me(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const shortToken = String(req.cookies?.shortTerm_token ?? '');
      const longToken = String(req.cookies?.longTerm_token ?? '');

      // 1. Over short token
      if (shortToken.length) {
        const decoded = verifyShortToken(shortToken);
        if (decoded?.id) {
          const user = await this.prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, username: true, role: true },
          });
          if (user) return { isLoggedIn: true, user };
        }
      }

      // 2. Fallback na long token
      if (!longToken.length) return { isLoggedIn: false };

      const decodedLong = verifyLongToken(longToken);
      if (!decodedLong?.id) return { isLoggedIn: false };

      const user = await this.prisma.user.findUnique({
        where: { id: decodedLong.id },
        select: { id: true, username: true, role: true },
      });

      if (!user) return { isLoggedIn: false };

      // 3. Refreshni short token
      const newShortToken = signShortToken(user.id, user.username);
      res.cookie('shortTerm_token', newShortToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      });

      return { isLoggedIn: true, user };

    } catch {
      return { isLoggedIn: false };
    }
  }
}