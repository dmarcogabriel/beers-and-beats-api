import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Beers and Beats example')
    .setDescription(
      "This API contains a CRUD for beers and a find by temperature endpoint, it doesn't need authentication to use it, when the api starts it get an auth token from spotify, and there is a cron job to re authenticate before the token expires.",
    )
    .setVersion('1.0')
    .addTag('beers')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
