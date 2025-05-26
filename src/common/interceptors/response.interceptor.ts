import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			map((data) => {
				return {
					statusCode: context.switchToHttp().getResponse().statusCode,
					message: context.switchToHttp().getRequest().route?.path || 'Success',
					data: data ?? null
				};
			})
		);
	}
}
