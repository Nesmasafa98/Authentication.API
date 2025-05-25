import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { winstonConfig } from './logger/winston.config';
import { WinstonModule } from 'nest-winston';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: WinstonModule.createLogger(winstonConfig)
	});

	app.enableCors({
		origin: 'http://localhost:5173',
		credentials: true
	});

	app.useGlobalInterceptors(new ResponseInterceptor());

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true
		})
	);
	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
