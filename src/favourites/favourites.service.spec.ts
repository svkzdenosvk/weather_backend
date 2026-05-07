import { Test, TestingModule } from '@nestjs/testing';
import { FavouritesService } from './favourites.service';
import { PrismaService } from '../prisma/prisma.service';

describe('FavouritesService', () => {
  let service: FavouritesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavouritesService,
        {
          provide: PrismaService,
          useValue: {
            favourite: {
              findMany: jest.fn(),
              create: jest.fn(),
              findUnique: jest.fn(),
              delete: jest.fn(),
            }
          }
        }
      ],
    }).compile();

    service = module.get<FavouritesService>(FavouritesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('getAll', () => {
    it('should return all favourites for user', async () => {
      const mockFavourites = [
        { id: '1', name: 'London', country: 'UK', lat: 51.5, lon: -0.1, userId: 'user1', createdAt: new Date() }
      ];
      jest.spyOn(prisma.favourite, 'findMany').mockResolvedValue(mockFavourites);

      const result = await service.getAll('user1');
      expect(result).toEqual(mockFavourites);
      expect(prisma.favourite.findMany).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('add', () => {
    it('should create a favourite', async () => {
      const city = { name: 'London', country: 'UK', lat: 51.5, lon: -0.1 };
      const mockResult = { id: '1', ...city, userId: 'user1', createdAt: new Date() };
      jest.spyOn(prisma.favourite, 'create').mockResolvedValue(mockResult);

      const result = await service.add('user1', city);
      expect(result).toEqual(mockResult);
    });
  });

  describe('remove', () => {
    it('should delete favourite if belongs to user', async () => {
      const mockFav = { id: '1', name: 'London', country: 'UK', lat: 51.5, lon: -0.1, userId: 'user1', createdAt: new Date() };
      jest.spyOn(prisma.favourite, 'findUnique').mockResolvedValue(mockFav);
      jest.spyOn(prisma.favourite, 'delete').mockResolvedValue(mockFav);

      await service.remove('user1', '1');
      expect(prisma.favourite.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException if favourite not found', async () => {
      jest.spyOn(prisma.favourite, 'findUnique').mockResolvedValue(null);

      await expect(service.remove('user1', 'nonexistent')).rejects.toThrow('Favourite not found');
    });

    it('should throw NotFoundException if favourite belongs to different user', async () => {
      const mockFav = { id: '1', name: 'London', country: 'UK', lat: 51.5, lon: -0.1, userId: 'user2', createdAt: new Date() };
      jest.spyOn(prisma.favourite, 'findUnique').mockResolvedValue(mockFav);

      await expect(service.remove('user1', '1')).rejects.toThrow('Favourite not found');
    });
  });
});