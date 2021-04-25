import { JoiErrorItem } from './joi.interface';

export type ErrorType =
      | 'BadGatewayException'
      | 'BadRequestException'
      | 'InternalServerErrorException'
      | 'UnauthorizedException'
      | 'NotFoundException'
      | 'ForbiddenException';

export interface ResponseBody<T> {
      message?: JoiErrorItem;
      data?: T;
      details?: Record<string, JoiErrorItem>;
}
