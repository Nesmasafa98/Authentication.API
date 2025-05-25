import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtLogoutStrategy extends PassportStrategy(Strategy, 'logout-jwt') {
	constructor(private configService: ConfigService) {
		const jwtSecret = configService.get<string>('JWT_ACCESS_SECRET');
		if (!jwtSecret) {
			throw new Error('JWT_ACCESS_SECRET is not defined');
		}
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: jwtSecret,
			ignoreExpiration: true
		});
	}

	async validate(payload: { sub: string; email: string }) {
		return { id: payload.sub, email: payload.email };
	}
}
