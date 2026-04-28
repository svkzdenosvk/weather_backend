import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DEFAULT_USER_IDS = [
  'cmogjpl6n0000fsumabzq6qw9',
  'cmogjt2ga00004wumzpfmp5ub',
];

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      include: { favourites: true },
      orderBy: { createdAt: 'asc' },
    });

    return users.map((u) => ({
      id: u.id,
      username: u.username,
      role: u.role,
      favouritesCount: u.favourites.length,
    }));
  }

  async deleteUser(id: string) {
    if (DEFAULT_USER_IDS.includes(id)) {
      throw new ForbiddenException('Cannot delete default users');
    }
    return this.prisma.user.delete({ where: { id } });
  }

  async updateRole(id: string, role: 'ADMIN' | 'USER') {
    if (DEFAULT_USER_IDS.includes(id)) {
      throw new ForbiddenException('Cannot change role of default users');
    }
    return this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }
}
