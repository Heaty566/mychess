import { Body, Controller, Post } from '@nestjs/common';
import { apiResponse } from '../app/interface/ApiResponse';
import { SmailService } from '../providers/smail/smail.service';
import { CommonService } from './common.service';
import { AboutUsDTO } from './dto/aboutUsDto';

@Controller('/')
export class CommonController {
      @Post('/about-us')
      async cAboutUs(@Body() body: AboutUsDTO) {
            return apiResponse.send<void>({ body: { message: 'server.thank-you-feedback' } });
      }
}
