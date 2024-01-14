import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { Request } from 'express';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGuard, JwtService, ConfigService],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if token is valid', async () => {
      // 先讓SkipAuth變成false不然會直接通過guard
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      const fakeToken = 'valid-token';
      const mockRequest = {
        headers: {
          authorization: `Bearer ${fakeToken}`,
        },
      } as Request;

      const mockContext: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      const spyJwTVerify = jest.spyOn(jwtService, 'verifyAsync');
      const resolvedUserPayload = { id: 1 };
      spyJwTVerify.mockResolvedValueOnce(resolvedUserPayload);

      const result = await authGuard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockRequest['user']).toStrictEqual(resolvedUserPayload);
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      // 先讓SkipAuth變成false不然會直接通過guard
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      const fakeToken = 'invalid-token';
      const mockRequest = {
        headers: {
          authorization: `Bearer ${fakeToken}`,
        },
      } as Request;

      const mockContext: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      const spyJwTVerify = jest.spyOn(jwtService, 'verifyAsync');
      spyJwTVerify.mockRejectedValueOnce(new Error('invalid token'));

      await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if no token', async () => {
      // 先讓SkipAuth變成false不然會直接通過guard
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      const mockRequest = {
        headers: {},
      } as Request;

      const mockContext: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('extractTokenFromHeader', () => {
    it('should return a token for valid Bearer token', () => {
      const fakeToken = 'valid-token';
      const request = {
        headers: {
          authorization: `Bearer ${fakeToken}`,
        },
      } as Request;

      expect(authGuard['extrackTokenFromHeader'](request)).toBe(fakeToken);
    });

    it('should return undefined if authorization header is missing', () => {
      const request = {
        headers: {},
      } as Request;

      expect(authGuard['extrackTokenFromHeader'](request)).toBe(undefined);
    });

    it('should return undefined for non-Bearer tokens', () => {
      const fakeToken = 'some-token';
      const request = {
        headers: {
          authorization: `Basic ${fakeToken}`,
        },
      } as Request;

      expect(authGuard['extrackTokenFromHeader'](request)).toBe(undefined);
    });

    it('should return undefined for incorrectly formatted tokens', () => {
      const request = {
        headers: {
          authorization: `Bearer`,
        },
      } as Request;

      expect(authGuard['extrackTokenFromHeader'](request)).toBe(undefined);
    });
  });
});
