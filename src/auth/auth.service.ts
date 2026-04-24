import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(username: string, password: string) {
    const exists = await this.prisma.user.findUnique({ where: { username } });
    if (exists) throw new ConflictException('Username already exists');

    const hashed = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { username, password: hashed },
    });

    return { message: 'User registered successfully', userId: user.id };
  }

  async login(username: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, username: user.username, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: { id: user.id, username: user.username, role: user.role },
    };
  }
}