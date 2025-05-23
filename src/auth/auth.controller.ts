// src/auth/auth.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
// import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('signup')
	async signup(@Body() dto: CreateUserDto) {
		const user = await this.authService.signup(dto.email, dto.name, dto.password);
		return { email: user.email, name: user.name };
	}

	@Post('signin')
	async signin(@Body() dto: SignInDto) {
		return this.authService.signin(dto.email, dto.password);
	}

	// @Post('refresh')
	// async refresh(@Body('refresh_token') refreshToken: string) {
	// 	return this.authService.refreshTokens(refreshToken);
	// }

	// @UseGuards(JwtAuthGuard)
	@Post('logout')
	logout() {
		return { message: 'Logged out' };
	}
}
