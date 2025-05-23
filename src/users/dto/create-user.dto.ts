import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
	@IsEmail()
	email: string;

	@IsString()
	@MinLength(3)
	name: string;

	@Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
		message:
			'Password must be at least 8 characters long, contain one letter, one number, and one special character.'
	})
	password: string;
}
