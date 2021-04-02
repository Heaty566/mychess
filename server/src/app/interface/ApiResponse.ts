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
      isTranslateDetails?: boolean;
}

export interface IApiError extends IApiBase<void> {
      type?: ErrorType;
}
class ApiResponse {
      constructor(private readonly localeService: LocalesService) {}

      /**
       *
       * @description allow translate message before send back to client
       */
      public sendError({ body, isTranslate = true, isTranslateDetails = false, type = 'BadRequestException', context = {} }: IApiError) {
            if (isTranslate && body.message) {
                  body.message = this.localeService.translate(body.message, { ...context });
            }
            if (isTranslateDetails && body.details) {
                  for (const item in body.details) {
                        body.details[item] = this.localeService.translate(body.details[item], { ...context });
                  }
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

      /**
       *
       * @description allow translate message before send back to client
       */
      public send<T>({ body, isTranslate, context }: IApiBase<T>) {
            if (isTranslate && body.message) {
                  body.message = this.localeService.translate(body.message, { ...context });
            }
            return body;
      }
}

export const apiResponse = new ApiResponse(new LocalesService());
