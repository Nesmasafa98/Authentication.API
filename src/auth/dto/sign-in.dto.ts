import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInReqDto {
	@IsEmail()
	@Transform(({ value }) => value.trim().toLowerCase())
	@ApiProperty({ example: 'john.doe@example.com' })
	email: string;

	@IsNotEmpty()
	@Transform(({ value }) => value.trim())
	@ApiProperty({ example: 'password@123' })
	password: string;
}
