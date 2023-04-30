import { BeerDto } from '../dto/beer.dto';

export const BeerDtoStub = (): BeerDto => ({
  style: 'Pilsens',
  idealTemperature: {
    min: -2,
    max: 4,
  },
});

export const BeerListDtoStub = (): BeerDto[] => [
  { style: 'Weissbier', idealTemperature: { min: -1, max: 3 } },
  { style: 'Pilsens', idealTemperature: { min: -2, max: 4 } },
  { style: 'Weizenbier', idealTemperature: { min: -4, max: 6 } },
  { style: 'Red ale', idealTemperature: { min: -5, max: 5 } },
  { style: 'India pale ale', idealTemperature: { min: -6, max: 7 } },
  { style: 'IPA', idealTemperature: { min: -7, max: 10 } },
  { style: 'Dunkel', idealTemperature: { min: -8, max: 2 } },
  { style: 'Imperial Stouts', idealTemperature: { min: -10, max: 13 } },
  { style: 'Brown ale', idealTemperature: { min: 0, max: 14 } },
];
