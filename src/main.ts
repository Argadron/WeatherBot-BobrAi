import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModuleLocal } from './swagger/swagger.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(`/api`)
  app.enableCors()
  
  SwaggerModuleLocal.forRoot(app)

  await app.listen(process.env.PORT, process.env.HOST);
}
bootstrap();
