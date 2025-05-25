import { IsEmail, IsString, Matches } from 'class-validator';

export class SignInReqDto {
	@IsEmail()
	email: string;

	@IsString()
	@Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
		message:
			'Password must be at least 8 characters long, contain one letter, one number, and one special character.'
	})
	password: string;
}

export class SignInResDto {
	accessToken: string;
	refreshToken: string;
	user: {
		id: string;
		email: string;
		name: string;
	};
}
