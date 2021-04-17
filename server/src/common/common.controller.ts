import { Body, Controller, Post, UsePipes } from '@nestjs/common';

//---- Service
import { CommonService } from './common.service';

//---- Pipe
import { JoiValidatorPipe } from '../utils/validator/validator.pipe';

//---- DTO
import { SupportDTO, vSupportDto } from './dto/aboutUsDto';

//---- Common
import { apiResponse } from '../app/interface/ApiResponse';

@Controller('/')
export class CommonController {
      constructor(private readonly commonService: CommonService) {}

      @Post('/support')
      @UsePipes(new JoiValidatorPipe(vSupportDto))
      async cSupport(@Body() body: SupportDTO) {
            return apiResponse.send<void>({ body: { message: { type: 'server.thank-you-feedback' } } });
      }
}
