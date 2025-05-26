import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class SignUpReqDto {
	@IsEmail()
	@Transform(({ value }) => value.trim().toLowerCase())
	@ApiProperty({ example: 'john.doe@example.com' })
	email: string;

	@IsString()
	@MinLength(3)
	@Transform(({ value }) => value.trim())
	@ApiProperty({ example: 'John Doe' })
	name: string;

	@Transform(({ value }) => value.trim())
	@Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
		message:
			'Password must be at least 8 characters long, contain one letter, one number, and one special character.'
	})
	@ApiProperty({ example: 'password@123' })
	password: string;
}
