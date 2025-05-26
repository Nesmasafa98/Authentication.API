import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { winstonConfig } from './logger/winston.config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: WinstonModule.createLogger(winstonConfig)
	});

	// Protect from HTTP header injection
	app.use(helmet());

	// Protect from NoSQL injection
	app.use(ExpressMongoSanitize());

	// CORS
	// Get from env your origin
	app.enableCors({
		origin: 'http://localhost:5173',
		credentials: true
	});

	// Interceptor for unifying response
	app.useGlobalInterceptors(new ResponseInterceptor());

	// Validate incoming requests
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true
		})
	);

	// Global exception filter
	app.useGlobalFilters(new AllExceptionsFilter());

	//Handle safe shutdown within modules.
	app.enableShutdownHooks();

	await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	process.exit(1);
});

process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception thrown:', error);
	process.exit(1);
});
