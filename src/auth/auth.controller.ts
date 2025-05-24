/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('signup')
	async signup(@Body() dto: CreateUserDto) {
		const tokens = await this.authService.signup(dto.email, dto.name, dto.password);
		return { tokens, message: 'User created successfully' };
	}

	@Post('signin')
	async signin(@Body() dto: SignInDto) {
		return this.authService.signin(dto.email, dto.password);
	}

	@Post('refresh')
	async refresh(@Body('refresh_token') refreshToken: string) {
		return this.authService.refreshTokens(refreshToken);
	}

	@UseGuards(JwtAuthGuard)
	@Post('logout')
	async logout(@Req() req) {
		const userId = req.user.id;
		return this.authService.logout(userId);
	}
}
