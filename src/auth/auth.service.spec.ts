import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
// import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { mockDeep } from 'jest-mock-extended';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient, Role } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { bcryptProvider } from 'src/bcrypt/bcrypt.provider';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  // let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        PrismaService,
        UsersService,
        bcryptProvider,
        JwtService,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signIn', () => {
    it('should throw Unauthorized Error', async () => {
      const fakeEmail = 'tiny@gmail.com';
      const fakePassword = '12345678Fake';
      const fakeUser = {
        id: 1,
        name: 'tiny',
        email: 'tiny@gmail.com',
        password:
          '$2b$10$V4CorPThGjQDTjPiHsmg3O3SO7nGfjjSyHtfanPWcs9Q/Sd9GY9gq',
        dewt: '12345678',
        role: Role.ADMIN,
        createAt: new Date(),
        updateAt: new Date(),
      };
      const spyUserService = jest.spyOn(usersService, 'findOne');
      spyUserService.mockResolvedValueOnce(fakeUser).mockResolvedValue(null);

      // 要用reject 去測試
      await expect(authService.signIn(fakeEmail, fakePassword)).rejects.toThrow(
        UnauthorizedException,
      );
      // 沒有user也應該要throw error
      await expect(authService.signIn(fakeEmail, fakePassword)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return jwt token when password correct', async () => {
      const fakeJwTToken = 'IAmFakeToken';
      const jwtMock = jest.spyOn(jwtService, 'signAsync');
      jwtMock.mockResolvedValueOnce(fakeJwTToken);

      const fakeEmail = 'tiny@gmail.com';
      const fakePassword = '12345678';
      const fakeUser = {
        id: 1,
        name: 'tiny',
        email: 'tiny@gmail.com',
        password:
          '$2b$10$V4CorPThGjQDTjPiHsmg3O3SO7nGfjjSyHtfanPWcs9Q/Sd9GY9gq',
        dewt: '12345678',
        role: Role.ADMIN,
        createAt: new Date(),
        updateAt: new Date(),
      };
      const spyUserService = jest.spyOn(usersService, 'findOne');
      spyUserService.mockResolvedValueOnce(fakeUser);

      const returnObject = await authService.signIn(fakeEmail, fakePassword);
      expect(returnObject).toStrictEqual({
        access_token: fakeJwTToken,
      });
    });
  });
});
