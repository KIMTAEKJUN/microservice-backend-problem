import { Test, TestingModule } from '@nestjs/testing';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';

describe('GatewayController', () => {
  let gatewayController: GatewayController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GatewayController],
      providers: [GatewayService],
    }).compile();

    gatewayController = app.get<GatewayController>(GatewayController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(
        gatewayController.register({
          name: 'test',
          email: 'test@test.com',
          password: 'test',
        }),
      ).toBe('Hello World!');
    });
  });
});
