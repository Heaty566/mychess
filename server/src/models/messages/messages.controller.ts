import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
      constructor(private readonly messagesService: MessagesService) {}
}
