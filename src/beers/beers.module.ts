import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { BeersService } from './beers.service';
import { BeersController } from './beers.controller';
import BeerSchema, { Beer } from './schemas/beer.schema';
import { SpotifyService } from '../common/spotify/spotify.service';
import { BeersUtils } from './beers.utils';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    MongooseModule.forFeature([{ name: Beer.name, schema: BeerSchema }]),
    CacheModule.register(),
  ],
  controllers: [BeersController],
  providers: [BeersService, SpotifyService, BeersUtils],
})
export class BeersModule {}
