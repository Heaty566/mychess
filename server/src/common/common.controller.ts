import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { JoiValidatorPipe } from '../utils/validator/validator.pipe';
import { apiResponse } from '../app/interface/ApiResponse';
import { SmailService } from '../providers/smail/smail.service';
import { CommonService } from './common.service';
import { SupportDTO, vSupportDto } from './dto/aboutUsDto';

@Controller('/')
export class CommonController {
      @Post('/support')
      @UsePipes(new JoiValidatorPipe(vSupportDto))
      async cSupport(@Body() body: SupportDTO) {
            return apiResponse.send<void>({ body: { message: 'server.thank-you-feedback' } });
      }
}
