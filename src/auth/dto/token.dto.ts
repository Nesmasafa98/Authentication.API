import { ApiProperty } from '@nestjs/swagger';

export class TokensResDto {
	@ApiProperty()
	accessToken: string;

	@ApiProperty()
	refreshToken: string;

	@ApiProperty({
		type: 'object',
		properties: {
			id: { type: 'string' },
			email: { type: 'string' },
			name: { type: 'string' }
		}
	})
	user: {
		id: string;
		email: string;
		name: string;
	};
}
