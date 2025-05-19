import { IsNotEmpty, IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { EventRewardType, EventStatus } from 'libs/database/enums/event.enum';

export class CreateRewardRequestDto {
  @IsEnum(EventRewardType, { message: '올바른 보상 타입을 선택해주세요.' })
  @IsNotEmpty({ message: '보상 타입은 필수 입력 항목입니다.' })
  type: EventRewardType;

  @IsNumber()
  @IsNotEmpty({ message: '보상 수량은 필수 입력 항목입니다.' })
  quantity: number;
}

export class GetRewardsRequestDto {
  @IsString()
  @IsNotEmpty({ message: '이벤트 ID는 필수 입력 항목입니다.' })
  eventId: string;
}

export class RewardIdParamDto {
  @IsString()
  @IsNotEmpty({ message: '보상 ID는 필수 입력 항목입니다.' })
  rewardId: string;
}

export class RequestRewardDto {
  @IsString()
  @IsNotEmpty({ message: '유저 ID는 필수 입력 항목입니다.' })
  userId: string;
}

export class GetRewardRequestsDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  eventId?: string;

  @IsEnum(EventStatus, { message: '올바른 이벤트 상태를 선택해주세요.' })
  @IsOptional()
  status?: EventStatus;
}

export class GetUserRewardRequestsDto {
  @IsString()
  @IsNotEmpty({ message: '유저 ID는 필수 입력 항목입니다.' })
  userId: string;
}

export class GetAdminRewardRequestsDto {
  @IsString()
  @IsOptional()
  eventId?: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsEnum(EventStatus, { message: '올바른 이벤트 상태를 선택해주세요.' })
  @IsOptional()
  status?: EventStatus;

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;
}
