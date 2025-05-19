export enum EventStatus {
  PENDING = 'PENDING', // 진행 중
  COMPLETED = 'COMPLETED', // 완료
  FAILED = 'FAILED', // 실패
  REJECTED = 'REJECTED', // 거절
}

export enum EventConditionType {
  LOGIN_COUNT = 'LOGIN_COUNT', // 로그인 횟수
  PURCHASE_AMOUNT = 'PURCHASE_AMOUNT', // 구매 금액
  REFERRAL_COUNT = 'REFERRAL_COUNT', // 추천 횟수
}

export enum EventRewardType {
  COUPON = 'COUPON', // 쿠폰
  POINT = 'POINT', // 포인트
  ITEM = 'ITEM', // 아이템
}
