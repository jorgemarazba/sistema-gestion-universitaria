import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import helmet from 'helmet'; // Importante para Seguridad RV035

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Seguridad de Cabeceras (RV035)
  app.use(helmet());

  // 2. Configuración de CORS para que el Frontend pueda hablar con el Backend
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
  });

  // 3. Prefijo global para todas las rutas (excepto /)
  app.setGlobalPrefix('api/v1', { exclude: ['/'] });

  // 4. Registrar el Filtro Global de Errores
  app.useGlobalFilters(new AllExceptionsFilter());

  // 5. Registrar el Interceptor Global
  app.useGlobalInterceptors(new TransformInterceptor());

  // 6. Configuración de Validación Global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      disableErrorMessages: false,
    }),
  );

  // 7. Configurar Swagger DESPUÉS de setGlobalPrefix
  const config = new DocumentBuilder()
    .setTitle('Plataforma Educativa')
    .setDescription('API para gestión administrativa y académica')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3003;
  await app.listen(port);
  console.log(` Servidor corriendo en: http://localhost:${port}`);
  console.log(` Documentación en: http://localhost:${port}/api/docs`);
}
void bootstrap();
