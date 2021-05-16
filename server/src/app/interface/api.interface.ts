import { JoiErrorItem } from './joi.interface';

export type ErrorType =
      | 'BadGatewayException'
      | 'BadRequestException'
      | 'InternalServerErrorException'
      | 'UnauthorizedException'
      | 'NotFoundException'
      | 'ForbiddenException';

export interface ResponseBodyDetails {
      message?: JoiErrorItem;
      errorMessage?: JoiErrorItem;
      [key: string]: JoiErrorItem;
}
export interface ServerBodyDetails {
      message?: string;
      errorMessage?: string;
      [key: string]: string;
}

export interface ResponseBody<T> {
      data?: T;
      details?: ResponseBodyDetails;
}
export interface ServerResponse<T> {
      data?: T;
      details?: ServerBodyDetails;
}
