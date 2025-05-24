import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		MongooseModule.forRoot('mongodb://localhost/AuthenticationDB'), // use env var for prod
		AuthModule,
		ConfigModule.forRoot({
			isGlobal: true // makes it accessible everywhere
		})
	]
})
export class AppModule {}
