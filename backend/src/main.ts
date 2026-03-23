import { NestFactory } from '@nestjs/core';
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
    origin: 'http://localhost:5173', // La URL por defecto de Vite
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 3. Registrar el Filtro Global de Errores (Lo que creamos en common/filters)
  app.useGlobalFilters(new AllExceptionsFilter());

  // 4. Registrar el Interceptor Global (Lo que creamos en common/interceptors)
  app.useGlobalInterceptors(new TransformInterceptor());

  // 5. Configuración de Validación Global (RV001)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Borra datos que no estén en el DTO
      forbidNonWhitelisted: true, // Lanza error si envían datos de más
      transform: true, // Convierte los tipos automáticamente
    }),
  );

  // 6. Prefijo global para todas las rutas (opcional pero profesional)
  app.setGlobalPrefix('api/v1');

  await app.listen(3000);
  console.log('🚀 Backend corriendo en: http://localhost:3000/api/v1');
}
void bootstrap();
