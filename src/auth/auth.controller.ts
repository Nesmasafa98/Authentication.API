/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInReqDto } from './dto/sign-in.dto';
import { SignUpReqDto } from './dto/sign-up.dto';
import { TokensResDto } from './dto/token.dto';
import { JwtLogoutAuthGuard } from './guards/logout-jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@HttpCode(HttpStatus.CREATED)
	@Post('signup')
	async signup(@Body() dto: SignUpReqDto): Promise<TokensResDto> {
		return await this.authService.signup(dto.email, dto.name, dto.password);
	}

	@HttpCode(HttpStatus.OK)
	@Post('signin')
	async signin(@Body() dto: SignInReqDto): Promise<TokensResDto> {
		return await this.authService.signin(dto.email, dto.password);
	}

	@HttpCode(HttpStatus.OK)
	@Post('refresh')
	async refresh(@Body('refreshToken') refreshToken: string): Promise<TokensResDto> {
		return this.authService.refreshTokens(refreshToken);
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtLogoutAuthGuard)
	@Post('logout')
	async logout(@Req() req) {
		const userId = req.user.id;
		return this.authService.logout(userId);
	}
}
