import { SocketJoiValidatorPipe } from '../socketValidator.pipe';
import * as Joi from 'joi';

const ObjValidator = Joi.object({
      data: Joi.string().lowercase().required(),
});

describe('SocketJoiValidatorPipe', () => {
      let socketJoiValidator: SocketJoiValidatorPipe;
      beforeAll(() => {
            socketJoiValidator = new SocketJoiValidatorPipe(ObjValidator);
      });

      it('Pass', () => {
            const result = socketJoiValidator.transform({ data: 'HEllo' });
            expect(result.data).toBe('hello');
      });
      it('Failed', () => {
            try {
                  socketJoiValidator.transform({ data: 1 });
            } catch (err) {
                  expect(err).toBeDefined();
            }
      });
});
