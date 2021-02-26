import { BadGatewayException, BadRequestException, InternalServerErrorException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Dictionary, LocalesService } from '../../utils/locales/locales.service';

type Type = 'BadGatewayException' | 'BadRequestException' | 'InternalServerErrorException' | 'UnauthorizedException' | 'NotFoundException';
interface IApiResponse<T> {
      message?: Dictionary;
      data?: T;
      details?: Record<string, string>;
}
class ApiResponse {
      constructor(private readonly localeService: LocalesService) {}

      public sendError(input: IApiResponse<void>, type: Type, isTranslate = true) {
            if (isTranslate && input.message) {
                  input.message = this.localeService.translate(input.message);
            }
            switch (type) {
                  case 'BadGatewayException':
                        return new BadGatewayException(input);
                  case 'BadRequestException':
                        return new BadRequestException(input);
                  case 'InternalServerErrorException':
                        return new InternalServerErrorException(input);
                  case 'UnauthorizedException':
                        return new UnauthorizedException(input);
                  case 'NotFoundException':
                        return new NotFoundException(input);
            }
      }

      public send(input: IApiResponse<void>, isTranslate = true) {
            if (isTranslate && input.message) {
                  input.message = this.localeService.translate(input.message);
            }
            return input;
      }
}

export const apiResponse = new ApiResponse(new LocalesService());
