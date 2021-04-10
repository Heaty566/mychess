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
      context?: Record<string, string>;
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
      public sendError({ body, type = 'BadRequestException', context = {} }: IApiError) {
            if (body.message) body.message = this.localeService.translate(body.message, { ...context });

            if (body.details) {
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
      public send<T>({ body, context }: IApiBase<T>) {
            if (body.message) body.message = this.localeService.translate(body.message, { ...context });

            return body;
      }
}

export const apiResponse = new ApiResponse(new LocalesService());
