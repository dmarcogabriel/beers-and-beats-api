import { Test, TestingModule } from '@nestjs/testing';
import { BeersUtils } from '../beers.utils';
import { Beer } from '../../beers/schemas/beer.schema';

const mockBeerList = [
  {
    style: 'ABa',
    idealTemperature: {
      min: -2,
      max: 0,
    },
  },
  {
    style: 'Ccc',
    idealTemperature: {
      min: -2,
      max: 0,
    },
  },
  {
    style: 'ABb',
    idealTemperature: {
      min: -2,
      max: 0,
    },
  },
  {
    style: 'Bbb',
    idealTemperature: {
      min: -2,
      max: 0,
    },
  },
  {
    style: 'Aaa',
    idealTemperature: {
      min: -2,
      max: 0,
    },
  },
];

describe('BeersUtils', () => {
  let utils: BeersUtils;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BeersUtils],
    }).compile();

    utils = module.get<BeersUtils>(BeersUtils);
  });

  afterEach(jest.clearAllMocks);

  it('should be defined', () => {
    expect(utils).toBeDefined();
  });

  describe('getAlphaFirstBeer', () => {
    it('should get beer ordered', () => {
      const sorted = utils.getAlphaFirstBeer([...mockBeerList] as Beer[]);
      expect(sorted.style).toBe('Aaa');
    });

    it('should get beer ordered 2', () => {
      const [first, second, , fourth] = mockBeerList;
      const sorted = utils.getAlphaFirstBeer([first, second, fourth] as Beer[]);
      expect(sorted.style).toBe('ABa');
    });
  });
});
