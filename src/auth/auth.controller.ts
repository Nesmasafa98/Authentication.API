// src/auth/auth.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

class AuthDto {
	username: string;
	password: string;
}

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('signup')
	async signup(@Body() authDto: AuthDto) {
		const user = await this.authService.signup(authDto.username, authDto.password);
		return { id: user.id, username: user.username };
	}

	@Post('signin')
	async signin(@Body() authDto: AuthDto) {
		return this.authService.signin(authDto.username, authDto.password);
	}

	@Post('refresh')
	async refresh(@Body('refresh_token') refreshToken: string) {
		return this.authService.refreshTokens(refreshToken);
	}

	// @UseGuards(JwtAuthGuard)
	@Post('logout')
	logout() {
		return { message: 'Logged out' };
	}
}
