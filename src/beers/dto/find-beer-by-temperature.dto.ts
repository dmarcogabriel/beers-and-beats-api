import { ApiProperty } from '@nestjs/swagger';

export class FindBeerByTemperature {
  @ApiProperty()
  readonly temperature: number;
}
