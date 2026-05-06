import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavouritesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(userId: string) {
    return this.prisma.favourite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async add(
    userId: string,
    city: { name: string; country: string; lat: number; lon: number },
  ) {
    return this.prisma.favourite.create({
      data: { ...city, userId },
    });
  }

  async remove(userId: string, favouriteId: string) {
    const favourite = await this.prisma.favourite.findUnique({
      where: { id: favouriteId },
    });

    if (!favourite || favourite.userId !== userId) {
      throw new NotFoundException('Favourite not found');
    }

    return this.prisma.favourite.delete({
      where: { id: favouriteId },
    });
  }
}
