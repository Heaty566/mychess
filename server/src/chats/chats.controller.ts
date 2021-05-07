import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { apiResponse } from '../app/interface/apiResponse';
import { UserGuard } from '../auth/auth.guard';

@Controller('chats')
export class ChessController {
      @Post('/new')
      @UseGuards(UserGuard)
      async handleOnCreatePvP(@Req() req: Request) {
            return apiResponse.send({ data: {} });
      }
}
