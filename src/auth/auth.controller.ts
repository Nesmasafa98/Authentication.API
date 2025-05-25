/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInReqDto, SignInResDto } from './dto/sign-in.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { SignUpReqDto, SignUpResDto } from './dto/sign-up.dto';

@Controller('api/auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('signup')
	async signup(@Body() dto: SignUpReqDto): Promise<ApiResponseDto<SignUpResDto>> {
		const { user, accessToken, refreshToken } = await this.authService.signup(dto.email, dto.name, dto.password);
		return {
			statusCode: 200,
			message: 'User signed in successfully',
			data: {
				accessToken,
				refreshToken,
				user
			}
		};
	}

	@Post('signin')
	async signin(@Body() dto: SignInReqDto): Promise<ApiResponseDto<SignInResDto>> {
		const { user, accessToken, refreshToken } = await this.authService.signin(dto.email, dto.password);
		return {
			statusCode: 200,
			message: 'User signed in successfully',
			data: {
				accessToken,
				refreshToken,
				user
			}
		};
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
