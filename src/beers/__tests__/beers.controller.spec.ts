import { Test, TestingModule } from '@nestjs/testing';
import { BeersController } from '../beers.controller';
import { BeersService } from '../beers.service';
import { BeerDtoStub, BeerListDtoStub } from './beer.dto.stub';

const mockBeerService = {
  create: jest.fn(() => BeerDtoStub()),
  findAll: jest.fn(() => BeerListDtoStub()),
  update: jest.fn(() => BeerDtoStub()),
  remove: jest.fn(),
  findByTemperature: jest.fn(() => BeerDtoStub()),
};

jest.mock('./beers.service');

describe('BeersController', () => {
  let controller: BeersController;
  let service: BeersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BeersController],
      providers: [
        BeersService,
        {
          provide: 'BeersService',
          useValue: mockBeerService,
        },
      ],
    }).compile();

    controller = module.get<BeersController>(BeersController);
    service = module.get<BeersService>(BeersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create beer', async () => {
    const mockBeer = BeerDtoStub();
    await controller.create(mockBeer);
    expect(service.create).toHaveBeenCalledWith(mockBeer);
  });

  it('should get beers', async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should update beer', async () => {
    const mockBeer = BeerDtoStub();
    await controller.update('testId', mockBeer);
    expect(service.update).toHaveBeenCalledWith('testId', mockBeer);
  });

  it('should remove beer', async () => {
    await controller.remove('removeId');
    expect(service.remove).toHaveBeenCalledWith('removeId');
  });

  it('should find beer by temperature', async () => {
    await controller.findByTemperature({ temperature: -2 });
    expect(service.findByTemperature).toHaveBeenCalledWith(-2);
  });
});
