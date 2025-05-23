/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,

		@InjectModel(User.name) private userModel: Model<UserDocument>
	) {}

	async signup(email: string, name: string, password: string): Promise<User> {
		const existingUser = await this.usersService.findByEmail(email);
		if (existingUser) {
			throw new UnauthorizedException('Username already exists');
		}
		return this.usersService.create(email, name, password);
	}

	async signin(username: string, password: string) {
		const user = await this.usersService.validateUser(username, password);
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const payload = { username: user.email };
		const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
		// const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

		return {
			access_token: accessToken
			// refresh_token: refreshToken
		};
	}

	// async refreshTokens(refreshToken: string) {
	// 	try {
	// 		const payload = this.jwtService.verify(refreshToken, {
	// 			secret: 'your_jwt_secret_key'
	// 		});
	// 		const user = await this.usersService.findByUsername(payload.username);
	// 		if (!user) throw new UnauthorizedException();

	// 		const newPayload = { username: user.username, sub: user.id };
	// 		return {
	// 			access_token: this.jwtService.sign(newPayload, { expiresIn: '15m' }),
	// 			refresh_token: this.jwtService.sign(newPayload, { expiresIn: '7d' })
	// 		};
	// 	} catch (err) {
	// 		throw new UnauthorizedException('Invalid refresh token');
	// 	}
	// }
}
