import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from '../users.service';
@ApiTags('Users')
@Controller('api/users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.OK)
	@Get()
	@ApiOperation({ summary: 'Get all users' })
	@ApiResponse({ status: HttpStatus.OK, description: 'List of users.' })
	async getAllUsers() {
		return this.usersService.findAll();
	}
}
