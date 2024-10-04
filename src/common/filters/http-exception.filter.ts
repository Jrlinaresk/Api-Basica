import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationError } from 'class-validator';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: any = {
      message: 'Internal server error',
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      errorResponse.message = exception.getResponse();
    }

    if (exception instanceof BadRequestException) {
      status = HttpStatus.BAD_REQUEST;
      const validationErrors = exception.getResponse() as {
        message: string;
        errors: ValidationError[];
      };

      errorResponse = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: 'Validation failed',
        errors: validationErrors.errors,
      };
    }

    response.status(status).json(errorResponse);
  }
}
