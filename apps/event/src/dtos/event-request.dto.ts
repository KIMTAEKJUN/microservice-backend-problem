import { IsArray, IsBoolean, IsNotEmpty, IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { EventCondition, Reward } from 'libs/database/schemas/event.schema';

export class CreateEventRequestDto {
  @IsString()
  @IsNotEmpty({ message: '이벤트 이름은 필수 입력 항목입니다.' })
  name: string;

  @IsBoolean({ message: '이벤트 활성 여부 형식이 올바르지 않습니다.' })
  @IsNotEmpty({ message: '이벤트 활성 여부는 필수 입력 항목입니다.' })
  isActive: boolean;

  @IsDate({ message: '이벤트 시작일 형식이 올바르지 않습니다.' })
  @Type(() => Date)
  @IsNotEmpty({ message: '이벤트 시작일은 필수 입력 항목입니다.' })
  startDate: Date;

  @IsDate({ message: '이벤트 종료일 형식이 올바르지 않습니다.' })
  @Type(() => Date)
  @IsNotEmpty({ message: '이벤트 종료일은 필수 입력 항목입니다.' })
  endDate: Date;

  @IsArray({ message: '이벤트 조건은 배열 형식이어야 합니다.' })
  @IsNotEmpty({ message: '이벤트 조건은 필수 입력 항목입니다.' })
  conditions: EventCondition[];

  @IsArray({ message: '보상은 배열 형식이어야 합니다.' })
  @IsOptional()
  rewards?: Reward[];
}

export class GetEventsRequestDto {
  @IsBoolean({ message: '이벤트 활성 여부 형식이 올바르지 않습니다.' })
  @IsOptional()
  isActive?: boolean;
}

export class GetEventRequestDto {
  @IsString()
  @IsNotEmpty({ message: '이벤트 ID는 필수 입력 항목입니다.' })
  eventId: string;

  @IsString()
  @IsNotEmpty({ message: '유저 ID는 필수 입력 항목입니다.' })
  userId: string;
}

export class UpdateEventStatusRequestDto {
  @IsBoolean({ message: '이벤트 활성 여부는 필수 입력 항목입니다.' })
  @IsNotEmpty({ message: '이벤트 활성 여부는 필수 입력 항목입니다.' })
  isActive: boolean;
}

export class EventIdParamDto {
  @IsString()
  @IsNotEmpty({ message: '이벤트 ID는 필수 입력 항목입니다.' })
  eventId: string;
}
