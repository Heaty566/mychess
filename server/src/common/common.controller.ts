import { Body, Controller, Post, UsePipes } from '@nestjs/common';

//---- Service
import { CommonService } from './common.service';

//---- Pipe
import { JoiValidatorPipe } from '../utils/validator/validator.pipe';

//---- DTO
import { SupportDTO, vSupportDto } from './dto/aboutUsDto';

//---- Common
import { apiResponse } from '../app/interface/apiResponse';

@Controller('/')
export class CommonController {
      constructor(private readonly commonService: CommonService) {}

      @Post('/support')
      @UsePipes(new JoiValidatorPipe(vSupportDto))
      async cSupport(@Body() body: SupportDTO) {
            //* need to add more function
            return apiResponse.send({ details: { message: { type: 'message.thank-you-feedback' } } });
      }
}
