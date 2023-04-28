export class CreateBeerDto {
  readonly style: string;
  readonly idealTemperature: {
    max: number;
    min: number;
  };
}
