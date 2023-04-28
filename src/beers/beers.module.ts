import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BeersService } from './beers.service';
import { BeersController } from './beers.controller';
import { Beer, BeerSchema } from './schemas/beer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Beer.name, schema: BeerSchema }]),
  ],
  controllers: [BeersController],
  providers: [BeersService],
})
export class BeersModule {}
