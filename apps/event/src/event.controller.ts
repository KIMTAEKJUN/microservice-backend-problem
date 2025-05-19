import { Controller } from '@nestjs/common';
import { EventService } from './event.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateEventRequestDto, EventIdParamDto, GetEventsRequestDto, UpdateEventStatusRequestDto } from './dtos/event-request.dto';
import { EventResponseDto, EventsResponseDto } from './dtos/event-response.dto';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // 이벤트 생성
  @MessagePattern('admin-create-event')
  async createEvent(@Payload() payload: CreateEventRequestDto): Promise<EventResponseDto> {
    const event = await this.eventService.createEvent(payload);
    return {
      success: true,
      message: '이벤트 생성이 완료되었습니다.',
      event,
    };
  }

  // 이벤트 목록 조회
  @MessagePattern('get-events')
  async getEvents(@Payload() payload: GetEventsRequestDto): Promise<EventsResponseDto> {
    const events = await this.eventService.getEvents(payload.isActive);
    return {
      success: true,
      message: '이벤트 전체 목록이 조회되었습니다.',
      events,
    };
  }

  // 이벤트 상세 조회
  @MessagePattern('get-event')
  async getEventById(@Payload() payload: EventIdParamDto): Promise<EventResponseDto> {
    const event = await this.eventService.getEventById(payload.eventId);
    return {
      success: true,
      message: '이벤트 상세 내역이 조회되었습니다.',
      event,
    };
  }

  // 이벤트 상태 변경
  @MessagePattern('admin-update-event-status')
  async updateEventStatus(@Payload() payload: { param: EventIdParamDto; dto: UpdateEventStatusRequestDto }): Promise<EventResponseDto> {
    const event = await this.eventService.updateEventStatus(payload.param.eventId, payload.dto.isActive);
    return {
      success: true,
      message: '이벤트 상태 변경이 완료되었습니다.',
      event,
    };
  }
}
