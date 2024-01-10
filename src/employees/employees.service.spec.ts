import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesService } from './employees.service';
import { PrismaService } from '../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient, User } from '@prisma/client';

describe('EmployeesService', () => {
  let employeesService: EmployeesService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeesService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    employeesService = module.get<EmployeesService>(EmployeesService);
    prisma = module.get(PrismaService);

    // init test user
  });

  it('should be defined', () => {
    expect(employeesService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all user', async () => {
      const testUsers: User[] = [
        {
          id: 1,
          name: 'test1',
          email: 'a@a.com',
          role: 'INTERN',
          createAt: new Date(),
          updateAt: new Date(),
        },
        {
          id: 2,
          name: 'test1',
          email: 'a@a.com',
          role: 'ENGINEER',
          createAt: new Date(),
          updateAt: new Date(),
        },
      ];

      prisma.user.findMany.mockResolvedValueOnce(testUsers);

      const allUser = await employeesService.findAll();
      expect(allUser).toStrictEqual(testUsers);
    });

    it('should return user of certain role', async () => {
      const testUsers: User[] = [
        {
          id: 1,
          name: 'test1',
          email: 'a@a.com',
          role: 'INTERN',
          createAt: new Date(),
          updateAt: new Date(),
        },
      ];

      prisma.user.findMany.mockResolvedValueOnce(testUsers);

      const allUser = await employeesService.findAll('INTERN');
      expect(allUser).toStrictEqual(testUsers);
    });
  });
});
