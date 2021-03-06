import {
      BadGatewayException,
      BadRequestException,
      InternalServerErrorException,
      UnauthorizedException,
      NotFoundException,
      ForbiddenException,
} from '@nestjs/common';
import { Dictionary, LocalesService } from '../../utils/locales/locales.service';

type ErrorType =
      | 'BadGatewayException'
      | 'BadRequestException'
      | 'InternalServerErrorException'
      | 'UnauthorizedException'
      | 'NotFoundException'
      | 'ForbiddenException';
export interface IApiResponse<T> {
      message?: Dictionary;
      data?: T;
      details?: Record<string, Dictionary>;
}

export interface IApiBase<T> {
      body: IApiResponse<T>;
      isTranslate?: boolean;
      context?: Record<string, string>;
}

export interface IApiError extends IApiBase<void> {
      type?: ErrorType;
}
class ApiResponse {
      constructor(private readonly localeService: LocalesService) {}

      public sendError({ body, isTranslate = true, type = 'BadRequestException', context = {} }: IApiError) {
            if (isTranslate && body.message) {
                  body.message = this.localeService.translate(body.message, { ...context });
            }
            switch (type) {
                  case 'BadGatewayException':
                        return new BadGatewayException(body);
                  case 'BadRequestException':
                        return new BadRequestException(body);
                  case 'InternalServerErrorException':
                        return new InternalServerErrorException(body);
                  case 'UnauthorizedException':
                        return new UnauthorizedException(body);
                  case 'NotFoundException':
                        return new NotFoundException(body);
                  case 'ForbiddenException':
                        return new ForbiddenException(body);
            }
      }

      public send<T>({ body, isTranslate, context }: IApiBase<T>) {
            if (isTranslate && body.message) {
                  body.message = this.localeService.translate(body.message, { ...context });
            }
            return body;
      }
}

export const apiResponse = new ApiResponse(new LocalesService());
