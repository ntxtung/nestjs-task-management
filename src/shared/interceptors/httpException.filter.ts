import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { FastifyReply } from 'fastify';

export interface FailedResponse {
  code: number;
  message: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements HttpExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const status = exception.getStatus();

    response.status(status).send({
      code: status,
      message: exception.message,
    } as FailedResponse);
  }
}
