/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
		private configService: ConfigService
	) {}

	async signup(email: string, name: string, password: string) {
		const existingUser = await this.usersService.findByEmail(email);
		if (existingUser) {
			throw new ConflictException('User already exists');
		}
		const user = await this.usersService.create(email, name, password);

		const payload = { sub: user._id, email: user.email };
		const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
		const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

		return {
			user: { id: user._id, email: user.email, name: user.name },
			accessToken: accessToken,
			refreshToken: refreshToken
		};
	}

	async signin(username: string, password: string) {
		const user = await this.usersService.validateUser(username, password);
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const payload = { sub: user._id, email: user.email };
		const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

		const refreshToken = this.jwtService.sign(payload, { expiresIn: '24h' });

		return {
			user: { id: user._id, email: user.email, name: user.name },
			accessToken: accessToken,
			refreshToken: refreshToken
		};
	}

	async refreshTokens(refreshToken: string) {
		try {
			const payload = this.jwtService.verify(refreshToken, {
				secret: this.configService.get('JWT_REFRESH_SECRET')
			});

			const user = await this.usersService.findById(payload.sub);
			if (!user || !user.hashedRefreshToken) throw new UnauthorizedException();

			const isMatch = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
			if (!isMatch) throw new UnauthorizedException('Invalid refresh token');

			const newPayload = { sub: user._id };
			const accessToken = this.jwtService.sign(newPayload, {
				expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION_MINUTES'),
				secret: this.configService.get<string>('JWT_ACCESS_SECRET')
			});
			const newRefreshToken = this.jwtService.sign(newPayload, {
				expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION_DAYS'),
				secret: this.configService.get<string>('JWT_REFRESH_SECRET')
			});

			await this.usersService.updateRefreshToken(user._id, newRefreshToken);

			return {
				access_token: accessToken,
				refresh_token: newRefreshToken
			};
		} catch (err) {
			console.error('Refresh token error:', err);
			throw new UnauthorizedException('Invalid refresh token');
		}
	}

	async logout(userId: string) {
		await this.usersService.removeRefreshToken(userId);
		return { message: 'Logged out successfully' };
	}
}
