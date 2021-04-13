import { Body, Controller, Post, UsePipes, Get } from '@nestjs/common';
import { JoiValidatorPipe } from '../utils/validator/validator.pipe';
import { apiResponse } from '../app/interface/ApiResponse';
import { SmailService } from '../providers/smail/smail.service';
import { CommonService } from './common.service';
import { SupportDTO, vSupportDto } from './dto/aboutUsDto';
import { User } from '../users/entities/user.entity';

@Controller('/')
export class CommonController {
      constructor(private readonly commonService: CommonService) {}

      @Post('/support')
      @UsePipes(new JoiValidatorPipe(vSupportDto))
      async cSupport(@Body() body: SupportDTO) {
            return apiResponse.send<void>({ body: { message: 'server.thank-you-feedback' } });
      }

      @Get('/users')
      async cGetAllUsers() {
            const users = await this.commonService.getAllUsers();

            return apiResponse.send<Array<User>>({ body: { data: users } });
      }
}
