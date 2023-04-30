import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { BeersService } from './beers.service';
import { BeersController } from './beers.controller';
import BeerSchema, { Beer } from './schemas/beer.schema';
import { SpotifyService } from './spotify.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    MongooseModule.forFeature([{ name: Beer.name, schema: BeerSchema }]),
    ScheduleModule.forRoot(),
  ],
  controllers: [BeersController],
  providers: [BeersService, SpotifyService],
})
export class BeersModule {}
