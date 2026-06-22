import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  HttpCode,
  Param,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiParam,
} from '@nestjs/swagger';
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

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login user and set auth cookies' })
  @ApiResponse({
    status: 200,
    description:
      'Login successful — sets shortTerm_token and longTerm_token cookies',
    schema: {
      example: { user: { id: 1, username: 'john_doe', role: 'USER' } },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(
      dto.username,
      dto.password,
    );

    // const shortToken = signShortToken(user.id, user.username);
    const shortToken = signShortToken(user.id, user.username, user.role);
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
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Username already taken' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.username, dto.password);
  }

  @Get('logout')
  @HttpCode(200)
  @ApiCookieAuth('shortTerm_token')
  @ApiOperation({ summary: 'Logout user and clear auth cookies' })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    schema: { example: { success: true } },
  })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('shortTerm_token', {
      ...cookieOptions,
      expires: new Date(0),
    });
    res.clearCookie('longTerm_token', {
      ...cookieOptions,
      expires: new Date(0),
    });
    return { success: true };
  }

  @Get('me')
  @ApiCookieAuth('shortTerm_token')
  @ApiOperation({
    summary:
      'Get currently authenticated user (auto-refreshes short token if expired)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns user info or isLoggedIn: false',
    schema: {
      example: {
        isLoggedIn: true,
        user: { id: 1, username: 'john_doe', role: 'USER' },
      },
    },
  })
  async me(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
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

      // 3. Refresh short token
      const newShortToken = signShortToken(user.id, user.username, user.role);
      res.cookie('shortTerm_token', newShortToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      });

      return { isLoggedIn: true, user };
    } catch {
      return { isLoggedIn: false };
    }
  }

  // auth.controller.ts
  @Get('check-username/:username')
  @ApiOperation({ summary: 'Check if a username is available' })
  @ApiParam({
    name: 'username',
    description: 'Username to check',
    example: 'john_doe',
  })
  @ApiResponse({
    status: 200,
    description: 'Availability status',
    schema: { example: { available: true } },
  })
  async checkUsername(@Param('username') username: string) {
    const exists = await this.authService.usernameExists(username);
    return { available: !exists };
  }
}
