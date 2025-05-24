/* eslint-disable @typescript-eslint/require-await */
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

@Module({
	imports: [
		AuthModule,
		ConfigModule.forRoot({
			isGlobal: true
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				uri: configService.get<string>('MONGO_URI')
			})
		})
	],
	providers: []
})
export class AppModule {}
