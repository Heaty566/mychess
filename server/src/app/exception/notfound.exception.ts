import { ExceptionFilter, Catch, NotFoundException } from '@nestjs/common';

//* Internal import
import { apiResponse } from '../interface/ApiResponse';

@Catch(NotFoundException)
export class NotFoundApiHandler implements ExceptionFilter {
      catch() {
            return apiResponse.sendError({ body: { message: 'this method is undefined' }, type: 'NotFoundException' });
      }
}
