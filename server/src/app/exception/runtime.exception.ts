import { ExceptionFilter, Catch, InternalServerErrorException } from '@nestjs/common';

//* Internal import
import { apiResponse } from '../interface/ApiResponse';

@Catch(InternalServerErrorException)
export class RuntimeApiHandler implements ExceptionFilter {
      catch() {
            return apiResponse.sendError({
                  body: { data: null, message: 'Something went wrong, Please try again later' },
                  type: 'InternalServerErrorException',
            });
      }
}
