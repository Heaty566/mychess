import { BadGatewayException, BadRequestException, InternalServerErrorException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Dictionary, LocalesService } from '../../utils/locales/locales.service';

type ErrorType = 'BadGatewayException' | 'BadRequestException' | 'InternalServerErrorException' | 'UnauthorizedException' | 'NotFoundException';
interface IApiResponse<T> {
      message?: Dictionary;
      data?: T;
      details?: Record<string, Dictionary>;
}

interface IApiBase {
      body: IApiResponse<void>;
      isTranslate?: boolean;
      context?: Record<string, string>;
}

interface IApiError extends IApiBase {
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
            }
      }

      public send({ body, isTranslate, context }: IApiBase) {
            if (isTranslate && body.message) {
                  body.message = this.localeService.translate(body.message, { ...context });
            }
            return body;
      }
}

export const apiResponse = new ApiResponse(new LocalesService());
