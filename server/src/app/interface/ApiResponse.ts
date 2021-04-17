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

export interface MsgResponseItem {
      type: Dictionary;
      context?: Record<string, string>;
}
export interface IApiResponse<T> {
      message?: MsgResponseItem;
      data?: T;
      details?: Record<string, MsgResponseItem>;
}

export interface ApiBase<T> {
      body: IApiResponse<T>;
}

export interface ApiError extends ApiBase<void> {
      type?: ErrorType;
}

export interface ServerResponse {
      message?: string;
      details?: Record<any, string>;
      data?: any;
}
class ApiResponse {
      constructor(private readonly localeService: LocalesService) {}

      /**
       *
       * @description allow translate message before send back to client
       */
      public sendError({ body, type = 'BadRequestException' }: ApiError) {
            const res = this.localeService.translateResponse(body);

            switch (type) {
                  case 'BadGatewayException':
                        return new BadGatewayException(res);
                  case 'BadRequestException':
                        return new BadRequestException(res);
                  case 'InternalServerErrorException':
                        return new InternalServerErrorException(res);
                  case 'UnauthorizedException':
                        return new UnauthorizedException(res);
                  case 'NotFoundException':
                        return new NotFoundException(res);
                  case 'ForbiddenException':
                        return new ForbiddenException(res);
            }
      }

      /**
       *
       * @description allow translate message before send back to client
       */
      public send<T>({ body }: ApiBase<T>): ServerResponse {
            return this.localeService.translateResponse(body);
      }
}

export const apiResponse = new ApiResponse(new LocalesService());
