import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { DEFAULT_USER_IDS } from '../common/constants';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, username: true, role: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (DEFAULT_USER_IDS.includes(id)) {
      throw new ForbiddenException('Cannot edit default users');
    }

    if (dto.newPassword) {
      if (!dto.currentPassword) {
        throw new UnauthorizedException('Current password required');
      }
      const valid = await bcrypt.compare(dto.currentPassword, user.password);
      if (!valid) throw new UnauthorizedException('Invalid current password');
    }

    if (dto.username && dto.username !== user.username) {
      const exists = await this.prisma.user.findUnique({
        where: { username: dto.username },
      });
      if (exists) throw new ConflictException('Username already taken');
    }

    const updateData: any = {};
    if (dto.username) updateData.username = dto.username;
    if (dto.newPassword)
      updateData.password = await bcrypt.hash(dto.newPassword, 10);

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, username: true, role: true },
    });
  }
}
