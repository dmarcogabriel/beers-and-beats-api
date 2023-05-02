import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { BeersModule } from './beers/beers.module';
import { AppService } from './app.service';
import { SpotifyService } from './common/spotify/spotify.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    CacheModule.register(),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const mongoDbUri = configService.get<string>('MONGODB_URI');

        if (mongoDbUri) {
          return {
            uri: mongoDbUri,
          };
        }
      },
      inject: [ConfigService],
    }),
    BeersModule,
  ],
  controllers: [AppController],
  providers: [SpotifyService, AppService],
})
export class AppModule {}
