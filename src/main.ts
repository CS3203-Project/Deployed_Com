import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend communication
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = process.env.FRONTEND_URLS
        ? process.env.FRONTEND_URLS.split(',').map(url => url.trim())
        : [
            'http://localhost:5173', 
            'http://localhost:3000', 
            'https://zia-tgsix.ondigitalocean.app',
            'https://zia-frontend-ll7ny.ondigitalocean.app',
            'https://zia-backend-ll7ny.ondigitalocean.app'
          ];

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow all *.ondigitalocean.app domains
      if (origin && origin.endsWith('.ondigitalocean.app')) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  });
  
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
