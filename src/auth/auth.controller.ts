import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

export class RegisterDto {
  username: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body.username, body.password);
  }

  @Post('login')
  login(@Body() body: RegisterDto) {
    return this.authService.login(body.username, body.password);
  }
}