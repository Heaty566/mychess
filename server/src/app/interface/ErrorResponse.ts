import { BadGatewayException, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ApiResponse } from './ApiResponse';

type Type = 'BadGatewayException' | 'BadRequestException' | 'InternalServerErrorException' | 'UnauthorizedException';

export class ErrorResponse {
      public static send(input: ApiResponse<void>, type: Type) {
            switch (type) {
                  case 'BadGatewayException':
                        return new BadGatewayException(input);
                  case 'BadRequestException':
                        return new BadRequestException(input);
                  case 'InternalServerErrorException':
                        return new InternalServerErrorException(input);
                  case 'UnauthorizedException':
                        return new UnauthorizedException(input);
            }
      }
}
