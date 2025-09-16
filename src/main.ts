import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filter/exceptions';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const name = process.env.APP_NAME ?? "Nest"

  app.use(
    morgan(`[${name}] - :method :url :status :res[content-length] - :response-time ms`),
  );
  app.useGlobalFilters(new AllExceptionsFilter())

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
