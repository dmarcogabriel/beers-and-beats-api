import { ApiProperty } from '@nestjs/swagger';

class IdealTemperature {
  @ApiProperty()
  max: number;

  @ApiProperty()
  min: number;
}

export class BeerDto {
  @ApiProperty()
  readonly style: string;

  @ApiProperty({ type: () => IdealTemperature })
  readonly idealTemperature: IdealTemperature;
}
