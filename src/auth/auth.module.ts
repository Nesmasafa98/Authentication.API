/* eslint-disable @typescript-eslint/require-await */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	imports: [
		PassportModule,
		JwtModule.register({
			secret: 'your_jwt_secret_key',
			signOptions: { expiresIn: '15m' }
		}),
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_ACCESS_SECRET'),
				signOptions: { expiresIn: configService.get<string>('JWT_ACCESS_EXPIRATION_MINUTES') }
			}),
			inject: [ConfigService]
		})
	],
	providers: [AuthService, UsersService, JwtStrategy],
	controllers: [AuthController],
	exports: [AuthService, JwtModule]
})
export class AuthModule {}
