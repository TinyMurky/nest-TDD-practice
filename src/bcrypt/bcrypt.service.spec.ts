import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from './bcrypt.service';
import { bcryptProvider } from './bcrypt.provider';
import * as BcryptLib from 'bcrypt';

describe('BcryptService', () => {
  let bcryptService: BcryptService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptService, bcryptProvider],
    }).compile();

    bcryptService = module.get<BcryptService>(BcryptService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(bcryptService).toBeDefined();
  });

  const testWord = 'testWord';
  const testSaltRound = 10;
  let testHashedWord: string;

  describe('hash', () => {
    it('should create hash', () => {
      const spy = jest.spyOn(BcryptLib, 'hashSync');

      testHashedWord = bcryptService.hash(testWord, testSaltRound);

      expect(spy).toHaveBeenCalled();
    });

    it('should compare to be true', () => {
      expect(bcryptService.compare(testWord, testHashedWord)).toBe(true);
    });
  });
});
