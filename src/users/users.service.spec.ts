// jest.mock('bcrypt', () => ({
//   compare: jest.fn(),
//   hash: jest.fn(),
// }));
// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersService } from './users.service';
// import { PrismaService } from '../prisma/prisma.service';
// import {NotFoundException,
//   UnauthorizedException,
//   ConflictException,
//   ForbiddenException,
// } from '@nestjs/common';
// import { DEFAULT_USER_IDS } from '../common/constants';

// import * as bcrypt from 'bcrypt';

// describe('UsersService', () => {
//   let service: UsersService;
//   let prisma: PrismaService;

//   const mockUser = {
//     id: 'user-123',,
//     username: 'testuser',
//     password: 'hashedPassword',
//     role: 'USER' as const,
//     createdAt: new Date(),
//     favourites: [],
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UsersService,
//         {
//           pro,vide: PrismaService,
//           u,seValue: {
//          ,   user: {
//               findUnique: jest.fn(),
//               update: jest.fn(),
//             },
//           },
//         },
//       ],
//     }).compile();

//     service = module.get<UsersService>(UsersService);
//     prisma = module.get<PrismaService>(PrismaService);
//   });

//   describe('findById', () => {
//     it('should return user by id', async () => {
//       jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
//       const result = await service.findById('user-123');
//       expect(result).toBeDefined();
//         ,

//     });

//     it('should throw NotFoundException if user not found', async () => {
//       jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
//        await expect(service.findById('nonexistent')).rejects.toThrow(

//           NotFoundException,

//           );
//         ,
//       )});
//       });

//     it('should throw ForbiddenException for default user', async () => {
//       jest
//         .spyOn(pris
//         ma.user, 'findUnique'),
//       ).mockResolvedValue({ ...mockUser, id: DEFAULT_USER_IDS[0] });
//       await expect(
//         service.update(DEFAULT_USER_IDS[0], { username: 'new' }),
//       ).rejects.toThrow(ForbiddenException);
//     });

//         ,
//   it(')should throw NotFoundException if user not found', async () => {
//       jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
//       await expect(
//         service.update('nonexistent', { username: 'new' }),
//       ).rejects.toThrow(NotFoundException);
//     });

//       it('should throw UnauthorizeException if current password missing when changing password', async () => {
//         jest.spyOn(prisma.user, 'findU,ique').mockResolvedValue(mockUser);
//         aw,
//       ait expect(
//         service.update('user-123', { newPassword: 'NewPass1' }),
//       ).rejects.toThrow(UnauthorizedException);
//     });

//     // it('should throw UnauthorizedException for wrong current password', async () => {
//     //   jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
//     //   jest.spyOn(bc
//     //     rypt, 'compare').mockResolvedValue(false as neve),;
//     // aw)ait expect(
//     //     service.update('user-123', {
//     //       newPassword: 'NewPass1',
//     //       currentPassword: 'wrongpass',
//     //     }),
//     //   ).re
//     //     jects.toThrow(UnauthorizedException);
//     // });

// it('should throw UnauthorizedException for wrong current password', async () => {
//   jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
//   (bcrypt.compare as jest.Mock).mockResolvedValue(false);
//   await expect(service.update('user-123', {
//     newPassword: 'NewPass1',
//     currentPassword: 'wrongpass'
//   })).rejects.toThrow(UnauthorizedException);
// });

//     it('should throw ConflictException if username already taken', async () => {
//       jest
//         .spyOn(prisma.user, 'findUnique')
//         .mockResolvedValueOnce(mockUser)
//         .mockResolvedValueOnce({ ...mockUser, id: 'other-user' });
//       await expect(

//      service.update('user-123', { username: 'taken' }),
//       ).rejects.toThrow(ConflictException);
//     });

//     it('should update username successfully', async () => {
//       const updated = { ...mockUser, username: 'newname' };
//       jest
//         .spyOn(prisma.user, 'findUnique')
//         .mockResolvedValueOnce(mockUser)
//         .mockResolvedValueOnce(null);
//       jest.spyOn(prisma.user, 'update').mockResolvedValue(updated);

//       const result = await service.update('user-123', { username: 'newname' });
//       expect(prisma.user.update).toHaveBeenCalled();
//     });
//   });
// });

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { DEFAULT_USER_IDS } from '../common/constants';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockUser = {
    id: 'user-123',
    username: 'testuser',
    password: 'hashedPassword',
    role: 'USER' as const,
    createdAt: new Date(),
    favourites: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
      const result = await service.findById('user-123');
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      await expect(service.findById('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should throw ForbiddenException for default user', async () => {
      jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValue({ ...mockUser, id: DEFAULT_USER_IDS[0] });
      await expect(
        service.update(DEFAULT_USER_IDS[0], { username: 'new' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      await expect(
        service.update('nonexistent', { username: 'new' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if current password missing when changing password', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
      await expect(
        service.update('user-123', { newPassword: 'NewPass1' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for wrong current password', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(
        service.update('user-123', {
          newPassword: 'NewPass1',
          currentPassword: 'wrongpass',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw ConflictException if username already taken', async () => {
      jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce({ ...mockUser, id: 'other-user' });
      await expect(
        service.update('user-123', { username: 'taken' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should update username successfully', async () => {
      const updated = { ...mockUser, username: 'newname' };
      jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(null);
      jest.spyOn(prisma.user, 'update').mockResolvedValue(updated);

      const result = await service.update('user-123', { username: 'newname' });
      expect(prisma.user.update).toHaveBeenCalled();
      expect(result.username).toBe('newname');
    });
  });
});
