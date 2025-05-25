import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInReqDto {
	@IsEmail()
	@Transform(({ value }) => value.trim().toLowerCase())
	email: string;

	@IsNotEmpty()
	@Transform(({ value }) => value.trim())
	password: string;
}
