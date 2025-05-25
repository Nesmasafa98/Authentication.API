import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class SignUpReqDto {
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

export class SignUpResDto {
	user: {
		id: string;
		email: string;
		name: string;
	};
	accessToken: string;
	refreshToken: string;
}
