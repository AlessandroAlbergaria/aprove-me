import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { AppController } from './../src/app.controller';

describe('AppController (e2e)', () => {
  let appController: AppController;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    appController = moduleFixture.get<AppController>(AppController);
  });

  describe('health-check', () => {
    it('should return health check status', () => {
      const result = appController.healthCheck();

      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
    });
  });
});
