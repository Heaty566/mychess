import { ObjError } from '../validator/messageErrorMapper';

export class ApiResponse<T> {
      message?: string;
      data?: T;
      details?: ObjError;
}
