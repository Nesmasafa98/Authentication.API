/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInReqDto, SignInResDto } from './dto/sign-in.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SignUpReqDto, SignUpResDto } from './dto/sign-up.dto';

@Controller('api/auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@HttpCode(201)
	@Post('signup')
	async signup(@Body() dto: SignUpReqDto): Promise<SignUpResDto> {
		return await this.authService.signup(dto.email, dto.name, dto.password);
	}

	@HttpCode(200)
	@Post('signin')
	async signin(@Body() dto: SignInReqDto): Promise<SignInResDto> {
		return await this.authService.signin(dto.email, dto.password);
	}

	@HttpCode(200)
	@Post('refresh')
	async refresh(@Body('refresh_token') refreshToken: string) {
		return this.authService.refreshTokens(refreshToken);
	}

	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@Post('logout')
	async logout(@Req() req) {
		const userId = req.user.id;
		return this.authService.logout(userId);
	}
}
