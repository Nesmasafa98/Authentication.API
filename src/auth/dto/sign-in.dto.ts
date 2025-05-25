import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInReqDto {
	@IsEmail()
	email: string;

	@IsNotEmpty()
	password: string;
}
