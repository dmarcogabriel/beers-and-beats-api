import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BeersModule } from './beers/beers.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const dbPassword = configService.get<string>('DATABASE_PASSWORD');
        const dbName = configService.get<string>('DATABASE_NAME');

        if (dbPassword && dbName) {
          const password = encodeURIComponent(dbPassword);
          return {
            uri: `mongodb+srv://gabriel:${password}@cluster0.bkb6b.mongodb.net/${dbName}?retryWrites=true&w=majority`,
          };
        }
      },
      inject: [ConfigService],
    }),
    BeersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
