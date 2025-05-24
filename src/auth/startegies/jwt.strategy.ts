/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(private configService: ConfigService) {
		const jwtSecret = configService.get<string>('JWT_ACCESS_SECRET');
		if (!jwtSecret) {
			throw new Error('JWT_ACCESS_SECRET is not defined');
		}
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: jwtSecret
		});
	}

	async validate(payload: { sub: string; email: string }) {
		return { userId: payload.sub, email: payload.email };
	}
}
