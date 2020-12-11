import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface SuccessResponse<T> {
  code: number;
  data: T;
}

export class ResponseTransformInterceptors<T>
  implements NestInterceptor<T, SuccessResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<SuccessResponse<T>> | Promise<Observable<SuccessResponse<T>>> {
    return next.handle().pipe(
      map((data) => ({
        code: context.switchToHttp().getResponse().statusCode,
        data,
      })),
    );
  }
}
