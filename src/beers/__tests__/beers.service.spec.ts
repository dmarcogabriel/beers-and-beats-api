import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, connect } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { BeersService } from '../beers.service';
import BeerSchema, { Beer, BeerModel } from '../schemas/beer.schema';
import { BeerDtoStub, BeerListDtoStub } from './beer.dto.stub';
import { SpotifyService } from '../../common/spotify/spotify.service';
import { BeersUtils } from '../beers.utils';

jest.mock('../spotify.service');

describe('BeersService', () => {
  let service: BeersService;
  let mongoMemoryServer: MongoMemoryServer;
  let mongoConnection: Connection;
  let mockBeerModel: BeerModel;

  beforeAll(async () => {
    mongoMemoryServer = await MongoMemoryServer.create();
    mongoConnection = (await connect(mongoMemoryServer.getUri())).connection;
    mockBeerModel = mongoConnection.model<Beer, BeerModel>(
      Beer.name,
      BeerSchema,
    );
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BeersService,
        {
          provide: getModelToken(Beer.name),
          useValue: mockBeerModel,
        },
        SpotifyService,
        BeersUtils,
      ],
    }).compile();

    service = module.get<BeersService>(BeersService);
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongoMemoryServer.stop();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return the saved beer', async () => {
      const beerStub = BeerDtoStub();
      const createdBeer = await service.create(beerStub);
      expect(createdBeer.style).toBe(beerStub.style);
      expect(createdBeer.idealTemperature.max).toBe(
        beerStub.idealTemperature.max,
      );
      expect(createdBeer.idealTemperature.min).toBe(
        beerStub.idealTemperature.min,
      );
    });
  });

  describe('findAll', () => {
    it('should list all saved beers', async () => {
      const beerStub = BeerDtoStub();
      await service.create(beerStub);

      const beers = await service.findAll();
      expect(beers[0].style).toBe(beerStub.style);
    });
  });

  describe('update', () => {
    it('should update style an return updated beer', async () => {
      const beerStub = BeerDtoStub();
      const createdBeer = await service.create(beerStub);

      const updated = await service.update(createdBeer.id, {
        style: 'IPA',
      });

      if (updated) {
        expect(updated.style).toBe('IPA');
      }
    });

    it('should update ideal temperature an return updated beer', async () => {
      const beerStub = BeerDtoStub();
      const createdBeer = await service.create(beerStub);

      const updated = await service.update(createdBeer.id, {
        idealTemperature: {
          min: 0,
          max: 2,
        },
      });

      if (updated) {
        expect(updated.idealTemperature.min).toBe(0);
        expect(updated.idealTemperature.max).toBe(2);
      }
    });
  });

  describe('delete', () => {
    it('should remove created beer and show empty list', async () => {
      const beerStub = BeerDtoStub();
      const createdBeer = await service.create(beerStub);

      await service.remove(createdBeer.id);

      const beers = await service.findAll();
      expect(beers).toEqual([]);
    });
  });

  describe('find by temperature', () => {
    const mockBeerList = BeerListDtoStub();

    it('should find by temperature -2', async () => {
      await Promise.all(mockBeerList.map(async (beer) => service.create(beer)));

      const foundedBeer = await service.findByTemperature(-2);
      if (foundedBeer) {
        expect(foundedBeer.beerStyle).toBe('Dunkel');
      }
    });

    it('should find by temperature 1.5', async () => {
      const mockBeers = [mockBeerList[5], mockBeerList[7]];
      await Promise.all(mockBeers.map(async (beer) => service.create(beer)));

      const foundedBeer = await service.findByTemperature(1.5);
      if (foundedBeer) {
        expect(foundedBeer.beerStyle).toBe('Imperial Stouts');
      }
    });

    it('should find by temperature 20', async () => {
      await Promise.all(mockBeerList.map(async (beer) => service.create(beer)));

      const foundedBeer = await service.findByTemperature(20);
      if (foundedBeer) {
        expect(foundedBeer.beerStyle).toBe('Brown ale');
      }
    });

    it('should find by temperature -20', async () => {
      await Promise.all(mockBeerList.map(async (beer) => service.create(beer)));

      const foundedBeer = await service.findByTemperature(-20);
      if (foundedBeer) {
        expect(foundedBeer.beerStyle).toBe('Dunkel');
      }
    });
  });
});
