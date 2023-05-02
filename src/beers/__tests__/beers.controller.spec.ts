import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { BeersController } from '../beers.controller';
import { BeersService } from '../beers.service';
import { BeerDtoStub, BeerListDtoStub } from './beer.dto.stub';
import { IFindByTemperatureResponse } from '../interfaces/beersService.interface';
import { CreateBeerDto } from '../dto/create-beer.dto';
import { UpdateBeerDto } from '../dto/update-beer.dto';

const mockBeerByTemperature: IFindByTemperatureResponse = {
  beerStyle: 'Pilsens',
  playlist: {
    name: 'The pilsens',
    tracks: [{ artist: 'Artist 1', link: 'link 1', name: 'Track 1' }],
  },
};

const mockBeerService = {
  create: jest.fn(() => BeerDtoStub()),
  findAll: jest.fn(() => BeerListDtoStub()),
  update: jest.fn(() => BeerDtoStub()),
  remove: jest.fn(),
  findByTemperature: jest.fn().mockReturnValue(mockBeerByTemperature),
};

jest.mock('../beers.service');

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

  describe('create', () => {
    it('should create beer', async () => {
      const mockBeer = BeerDtoStub();
      await controller.create(mockBeer);
      expect(service.create).toHaveBeenCalledWith(mockBeer);
    });

    it('should fail on create beer', async () => {
      try {
        await controller.create(undefined as unknown as CreateBeerDto);
      } catch (exception) {
        expect(exception).toBeInstanceOf(HttpException);
        expect(exception.getResponse()).toEqual(
          'request body is missing "beer" object or it\'s invalid',
        );
      }
    });
  });

  it('should get beers', async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  describe('update', () => {
    it('should update beer', async () => {
      const mockBeer = BeerDtoStub();
      await controller.update('testId', mockBeer);
      expect(service.update).toHaveBeenCalledWith('testId', mockBeer);
    });

    it('should fail to update beer missing id', async () => {
      const mockBeer = BeerDtoStub();

      try {
        await controller.update('', mockBeer);
      } catch (exception) {
        expect(exception).toBeInstanceOf(HttpException);
        expect(exception.getResponse()).toEqual(
          'request params is missing "id"',
        );
      }
    });

    it('should fail to update beer missing body', async () => {
      try {
        await controller.update(
          'testId',
          undefined as unknown as UpdateBeerDto,
        );
      } catch (exception) {
        expect(exception).toBeInstanceOf(HttpException);
        expect(exception.getResponse()).toEqual(
          'request body is missing "beer" object or it\'s invalid',
        );
      }
    });
  });

  describe('delete', () => {
    it('should remove beer', async () => {
      await controller.remove('removeId');
      expect(service.remove).toHaveBeenCalledWith('removeId');
    });

    it('should remove beer', async () => {
      try {
        await controller.remove(undefined as unknown as string);
      } catch (exception) {
        expect(exception).toBeInstanceOf(HttpException);
        expect(exception.getResponse()).toEqual(
          'request params is missing "id"',
        );
      }
    });
  });
});
