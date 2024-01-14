import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { bcryptProvider } from 'src/bcrypt/bcrypt.provider';
import { PrismaService } from 'src/prisma/prisma.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        JwtService,
        bcryptProvider,
        PrismaService,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signIn', () => {
    it('should return access token', async () => {
      const spySignInService = jest.spyOn(authService, 'signIn');
      spySignInService.mockResolvedValueOnce({
        access_token: 'fake_token',
      });

      const fakesignInDto = {
        email: 'tiny@google.com',
        password: '12345678',
      };

      const loginToken = await authController.signIn(fakesignInDto);

      expect(loginToken).toStrictEqual({
        access_token: 'fake_token',
      });

      expect(spySignInService).toHaveBeenCalledWith(
        fakesignInDto.email,
        fakesignInDto.password,
      );
    });
  });
});
