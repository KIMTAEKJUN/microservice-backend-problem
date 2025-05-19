import { Event } from 'libs/database/schemas/event.schema';

export class EventResponseDto {
  success: boolean;
  message: string;
  event: Event;
}

export class EventsResponseDto {
  success: boolean;
  message: string;
  events: Event[];
}
