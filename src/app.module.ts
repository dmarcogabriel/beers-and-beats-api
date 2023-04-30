import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { BeersModule } from './beers/beers.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
})
export class AppModule {}
