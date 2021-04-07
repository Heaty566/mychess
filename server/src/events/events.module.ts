import { Module } from '@nestjs/common';
import { EventsGateWay } from './events.gateway';

@Module({
      providers: [EventsGateWay],
})
export class EventsModule {}
