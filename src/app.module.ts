import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
	imports: [
		AuthModule,
		UsersModule,
		ConfigModule.forRoot({
			isGlobal: true
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				uri: configService.get<string>('MONGO_URI')
			})
		}),
		ThrottlerModule.forRoot({
			throttlers: [
				{
					ttl: 6000,
					limit: 3
				}
			],
			errorMessage: 'Too many requests, please try again later.'
		})
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard
		}
	]
})
export class AppModule {}
