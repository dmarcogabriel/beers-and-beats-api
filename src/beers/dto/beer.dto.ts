export class BeerDto {
  readonly style: string;
  readonly idealTemperature: {
    max: number;
    min: number;
  };
}
