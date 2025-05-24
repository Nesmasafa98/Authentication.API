import { Injectable, Inject, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
	constructor(
		@Inject(WINSTON_MODULE_PROVIDER)
		private readonly logger: Logger
	) {}

	use(req: Request, res: Response, next: NextFunction): void {
		const { method, originalUrl } = req;
		const userAgent = req.get('user-agent') || '';
		const ip = req.ip;

		const start = Date.now();

		res.on('finish', () => {
			const { statusCode } = res;
			const contentLength = res.get('content-length') || '0';
			const duration = Date.now() - start;

			this.logger.info('HTTP Request', {
				method,
				path: originalUrl,
				statusCode,
				contentLength,
				userAgent,
				ip,
				duration: `${duration}ms`
			});
		});

		next();
	}
}
