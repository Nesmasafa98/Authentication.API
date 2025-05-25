import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './startegies/jwt.strategy';
import { JwtLogoutStrategy } from './startegies/logout-jwt.strategy';

@Module({
	imports: [
		PassportModule,
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
	providers: [AuthService, UsersService, JwtStrategy, JwtLogoutStrategy],
	controllers: [AuthController],
	exports: [AuthService, JwtModule]
})
export class AuthModule {}
