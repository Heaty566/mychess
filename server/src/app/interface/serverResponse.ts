import { Dictionary } from '../../utils/locales/locales.service';

export type ErrorType =
      | 'BadGatewayException'
      | 'BadRequestException'
      | 'InternalServerErrorException'
      | 'UnauthorizedException'
      | 'NotFoundException'
      | 'ForbiddenException';

export interface ApiMsgItem {
      type: Dictionary;
      context?: Record<string, string>;
}

export interface ApiResponseBody<T> {
      message?: ApiMsgItem;
      data?: T;
      details?: Record<string, ApiMsgItem>;
}

export interface ApiSuccess<T> {
      body: ApiResponseBody<T>;
}

export interface ApiError extends ApiSuccess<void> {
      type?: ErrorType;
}

export interface ApiServerResponse {
      message?: string;
      details?: Record<any, string>;
      data?: any;
}
