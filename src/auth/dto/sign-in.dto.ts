import { IsEmail, IsString, Matches } from 'class-validator';

export class SignInDto {
	@IsEmail()
	email: string;

	@IsString()
	@Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
		message:
			'Password must be at least 8 characters long, contain one letter, one number, and one special character.'
	})
	password: string;
}
