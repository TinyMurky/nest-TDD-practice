import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;
  // 放在beforeEach 裡的 jest.spyOn要先在外面init
  let connectToPrisma: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);

    // mock
    connectToPrisma = jest.spyOn(service, '$connect');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should connect to prisma when init(call $connect)', async () => {
    await service.onModuleInit();
    expect(connectToPrisma).toHaveBeenCalled();
  });
});
