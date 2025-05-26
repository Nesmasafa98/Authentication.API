import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { TokensResDto } from './dto/token.dto';
@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
		private configService: ConfigService
	) {}

	async signup(email: string, name: string, password: string): Promise<TokensResDto> {
		const existingUser = await this.usersService.findByEmail(email);
		if (existingUser) {
			throw new ConflictException('User already exists');
		}
		const user = await this.usersService.create(email, name, password);

		const { accessToken, refreshToken } = await this.setTokens(user);

		return {
			accessToken,
			refreshToken,
			user: {
				id: user._id,
				email: user.email,
				name: user.name
			}
		};
	}

	async signin(username: string, password: string): Promise<TokensResDto> {
		const user = await this.usersService.validateUser(username, password);
		if (!user) {
			throw new UnauthorizedException('Incorrect email or password.');
		}

		const { accessToken, refreshToken } = await this.setTokens(user);

		return {
			user: { id: user._id, email: user.email, name: user.name },
			accessToken,
			refreshToken
		};
	}

	async refreshTokens(oldRefreshToken: string): Promise<TokensResDto> {
		try {
			const payload = this.jwtService.verify<{ sub: string }>(oldRefreshToken, {
				secret: this.configService.get('JWT_REFRESH_SECRET')
			});

			const user = await this.usersService.findById(payload.sub);
			if (!user || !user.hashedRefreshToken) throw new UnauthorizedException();

			const isMatch = await bcrypt.compare(oldRefreshToken, user.hashedRefreshToken);
			if (!isMatch) throw new UnauthorizedException('Invalid refresh token');

			const { accessToken, refreshToken } = await this.setTokens(user);

			return {
				accessToken,
				refreshToken,
				user: {
					id: user._id,
					email: user.email,
					name: user.name
				}
			};
		} catch (err) {
			console.error('Refresh token error:', err);
			throw new UnauthorizedException('Invalid refresh token');
		}
	}

	async logout(userId: string): Promise<{ message: string }> {
		const user = await this.usersService.findById(userId);

		if (!user) {
			throw new NotFoundException('User not found');
		}

		await this.usersService.removeRefreshToken(userId);

		return {
			message: 'Logged out successfully'
		};
	}

	private async setTokens(user: User) {
		const payload = { sub: user._id, email: user.email };
		const accessToken = this.jwtService.sign(payload);
		const refreshToken = this.jwtService.sign(payload, {
			expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION_DAYS'),
			secret: this.configService.get('JWT_REFRESH_SECRET')
		});

		await this.usersService.updateRefreshToken(user._id, refreshToken);
		return { accessToken, refreshToken };
	}
}
