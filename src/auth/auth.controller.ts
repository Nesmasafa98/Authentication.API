import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import {
	ApiConflictResponse,
	ApiNotFoundResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInReqDto } from './dto/sign-in.dto';
import { SignUpReqDto } from './dto/sign-up.dto';
import { TokensResDto } from './dto/token.dto';
import { JwtLogoutAuthGuard } from './guards/logout-jwt-auth.guard';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@HttpCode(HttpStatus.CREATED)
	@Post('signup')
	@ApiOperation({ summary: 'Registers a new user with email, username, and password.' })
	@ApiResponse({ status: HttpStatus.CREATED, type: TokensResDto })
	@ApiConflictResponse({
		description: 'User already exists'
	})
	async signup(@Body() dto: SignUpReqDto): Promise<TokensResDto> {
		return await this.authService.signup(dto.email, dto.name, dto.password);
	}

	@HttpCode(HttpStatus.OK)
	@Post('signin')
	@ApiOperation({ summary: 'Authenticates user credentials and returns access and refresh tokens.' })
	@ApiResponse({ status: HttpStatus.OK, type: TokensResDto })
	@ApiUnauthorizedResponse({
		description: 'Incorrect email or password'
	})
	async signin(@Body() dto: SignInReqDto): Promise<TokensResDto> {
		return await this.authService.signin(dto.email, dto.password);
	}

	@HttpCode(HttpStatus.OK)
	@Post('refresh')
	@ApiOperation({ summary: 'Refreshes access and refresh tokens.' })
	@ApiResponse({ status: HttpStatus.OK, type: TokensResDto })
	@ApiUnauthorizedResponse({
		description: 'Ivalid refresh token'
	})
	async refresh(@Body('refreshToken') refreshToken: string): Promise<TokensResDto> {
		return this.authService.refreshTokens(refreshToken);
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtLogoutAuthGuard)
	@Post('logout')
	@ApiOperation({ summary: 'Logs out the current user.' })
	@ApiResponse({ status: HttpStatus.OK, type: String })
	@ApiNotFoundResponse({
		description: 'User not found'
	})
	async logout(@Req() req): Promise<{ message: string }> {
		const userId = req.user.id;
		return this.authService.logout(userId);
	}
}
