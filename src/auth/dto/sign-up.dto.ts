import { Transform } from 'class-transformer';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class SignUpReqDto {
	@IsEmail()
	@Transform(({ value }) => value.trim().toLowerCase())
	email: string;

	@IsString()
	@MinLength(3)
	@Transform(({ value }) => value.trim())
	name: string;

	@Transform(({ value }) => value.trim())
	@Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
		message:
			'Password must be at least 8 characters long, contain one letter, one number, and one special character.'
	})
	password: string;
}
