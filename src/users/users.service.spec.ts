import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient, Role } from '@prisma/client';

describe('UsersService', () => {
  let usersService: UsersService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    usersService = module.get<UsersService>(UsersService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('find all', () => {
    it('should find person with email', async () => {
      const fakeEmail = 'a@a.com';
      const fakeReturn = {
        id: 1,
        name: 'test1',
        email: fakeEmail,
        password: 'a',
        role: Role.INTERN,
        createAt: new Date(),
        updateAt: new Date(),
      };

      prisma.user.findUnique.mockResolvedValueOnce(fakeReturn);

      const testUser = await usersService.findOne(fakeEmail);
      expect(testUser).toStrictEqual(fakeReturn);
    });
  });
});
