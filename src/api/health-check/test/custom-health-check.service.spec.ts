import { CustomHealthCheckService } from '../custom-health-check.service';
import { Test, TestingModule } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';

describe('CustomHealthCheckService', () => {
  let service: CustomHealthCheckService;
  let queryBus: jest.Mock;

  beforeEach(async () => {
    queryBus = jest.fn().mockResolvedValue('');
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomHealthCheckService,
        {
          provide: QueryBus,
          useValue: {
            execute: queryBus,
          },
        },
      ],
    }).compile();

    service = module.get<CustomHealthCheckService>(CustomHealthCheckService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkHealth', () => {
    beforeEach(() => {
      queryBus = jest.fn().mockResolvedValue('');
    });
    it('should return health check response', async () => {
      const response = await service.checkHealth();
      expect(response).toBeDefined();
    });
  });
});
