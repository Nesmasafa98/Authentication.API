import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { winstonConfig } from './logger/winston.config';

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	process.exit(1);
});

process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception thrown:', error);
	process.exit(1);
});
async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: WinstonModule.createLogger(winstonConfig)
	});

	// Protect from HTTP header injection
	app.use(helmet());

	// Protect from NoSQL injection
	mongoose.set('sanitizeFilter', true);

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

	// --- Add Swagger setup here ---
	const config = new DocumentBuilder()
		.setTitle('Authentication API')
		.setDescription(
			'API for user authentication including signin, signup, token refresh, and logout functionalities.'
		)
		.setVersion('1.0')
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);
	// --- Swagger setup ends here ---

	await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
