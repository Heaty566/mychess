import { Injectable, PipeTransform } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ObjectSchema } from 'joi';

//---- Common
import { SocketResponseAction } from '../../app/interface/socket.action';

@Injectable()
export class SocketJoiValidatorPipe implements PipeTransform {
      constructor(private readonly schema: ObjectSchema) {}

      transform(input: any) {
            const { error, value } = this.schema.validate(input, { abortEarly: false });
            console.log(error);
            console.log(value);
            if (error)
                  throw new WsException({
                        event: SocketResponseAction.BAD_REQUEST,
                        data: {
                              isSuccess: false,
                              data: null,
                              details: { message: { type: 'user.not-allow-action' } },
                        },
                  });

            return value;
      }
}
