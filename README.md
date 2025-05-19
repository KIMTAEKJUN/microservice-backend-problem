# Microservice Event System

## 프로젝트 구조

- Gateway Service (3000번 포트)
- Auth Service (3001번 포트)
- Event Service (3002번 포트)
- MongoDB (27017번 포트)

<br>

## 실행 방법

### 1. 환경 설정

.env.example을 참고하여 .env 파일 생성

### 2. 서비스 실행

```bash
# 기존 컨테이너 중지 및 삭제
docker-compose down

# 이미지 재빌드 및 서비스 시작
docker-compose up -d --build

# 서비스 상태 확인
docker-compose ps

# 각 서비스의 로그 확인
docker-compose logs -f gateway-service
docker-compose logs -f auth-service
docker-compose logs -f event-service
```

### 3. MongoDB 사용자 생성

```bash
# MongoDB 컨테이너 접속
docker-compose exec mongodb mongosh -u taekjun -p 4126

# MongoDB 쉘에서
use microservice_mongodb
db.createUser({
  user: "taekjun",
  pwd: "4126",
  roles: [
    { role: "readWrite", db: "microservice_mongodb" }
  ]
})

# 기존 컨테이너 중지 및 삭제
docker-compose down

# 이미지 재시작
docker-compose up -d
```

### 4. PM2 서비스 상태 확인

```bash
# Gateway 서비스 상태 확인
docker-compose exec gateway-service pm2 status

# Auth 서비스 상태 확인
docker-compose exec auth-service pm2 status

# Event 서비스 상태 확인
docker-compose exec event-service pm2 status
```

<br>

## API 명세서

### 1. 인증 (Auth)

#### 1.1 회원가입

```
Endpoint: /auth/register
Method: POST
권한: 없음

요청 (Request Body):
{
  "name": "홍길동",
  "email": "hong@example.com",
  "password": "password123"
}

정상 응답 (200 OK):
{
  "success": true,
  "message": "유저 회원가입이 완료되었습니다.",
  "user": {
    "name": "홍길동",
    "email": "hong@example.com",
    "role": "USER"
  }
}
```

#### 1.2 로그인

```
Endpoint: /auth/login
Method: POST
권한: 없음

요청 (Request Body):
{
  "email": "hong@example.com",
  "password": "password123"
}

정상 응답 (200 OK):
{
  "success": true,
  "message": "유저 로그인이 완료되었습니다.",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "682b79db38765ca2e9490748",
    "name": "홍길동",
    "email": "hong@example.com",
    "role": "USER"
  }
}
```

#### 1.3 유저 목록 조회

```
Endpoint: /admin/get-users
Method: GET
권한: ADMIN

요청 (Request Body):
{
  "name": "홍",
  "email": "hong",
  "role": "USER"
}

정상 응답 (200 OK):
{
  "success": true,
  "message": "유저 목록이 조회되었습니다.",
  "users": [
    {
      "id": "682b79db38765ca2e9490748",
      "name": "홍길동",
      "email": "hong@example.com",
      "role": "USER"
    },
    {
      "id": "682b79db38765ca2e9490749",
      "name": "홍순이",
      "email": "hong2@example.com",
      "role": "USER"
    }
  ],
  "total": 2
}
```

#### 1.4 유저 권한 변경

```
Endpoint: /admin/:userId/role
Method: PUT
권한: ADMIN

요청 (Request Body):
{
  "role": "OPERATOR"
}

정상 응답 (200 OK):
{
  "success": true,
  "message": "유저 권한 변경이 완료되었습니다.",
  "role": "OPERATOR"
}
```

### 2. 이벤트 (Event)

#### 2.1 이벤트 생성

```
Endpoint: /event/create-event
Method: POST
권한: ADMIN, OPERATOR

요청 (Request Body):
{
  "name": "신규 가입자 이벤트",
  "isActive": true,
  "startDate": "2024-03-20T00:00:00Z",
  "endDate": "2024-04-20T23:59:59Z",
  "conditions": [
    {
      "type": "LOGIN_COUNT",
      "count": 5
    },
    {
      "type": "PURCHASE_AMOUNT",
      "amount": 50000
    }
  ],
  "rewards": [
    {
      "type": "POINT",
      "quantity": 1000
    },
    {
      "type": "COUPON",
      "quantity": 1
    }
  ]
}

정상 응답 (200 OK):
{
  "success": true,
  "message": "이벤트가 생성되었습니다.",
  "event": {
    "id": "682b79db38765ca2e9490750",
    "name": "신규 가입자 이벤트",
    "isActive": true,
    "startDate": "2024-03-20T00:00:00Z",
    "endDate": "2024-04-20T23:59:59Z",
    "conditions": [
      {
        "type": "LOGIN_COUNT",
        "count": 5
      },
      {
        "type": "PURCHASE_AMOUNT",
        "amount": 50000
      }
    ],
    "rewards": [
      {
        "type": "POINT",
        "quantity": 1000
      },
      {
        "type": "COUPON",
        "quantity": 1
      }
    ]
  }
}
```

#### 2.2 이벤트 목록 조회

```
Endpoint: /event/list
Method: GET
권한: ADMIN, OPERATOR, AUDITOR, USER

요청 (Request Body):
{
  "isActive": true
}

정상 응답 (200 OK):
{
  "success": true,
  "message": "이벤트 목록이 조회되었습니다.",
  "events": [
    {
      "id": "682b79db38765ca2e9490750",
      "name": "신규 가입자 이벤트",
      "isActive": true,
      "startDate": "2024-03-20T00:00:00Z",
      "endDate": "2024-04-20T23:59:59Z",
      "conditions": [
        {
          "type": "LOGIN_COUNT",
          "count": 5
        },
        {
          "type": "PURCHASE_AMOUNT",
          "amount": 50000
        }
      ],
      "rewards": [
        {
          "type": "POINT",
          "quantity": 1000
        },
        {
          "type": "COUPON",
          "quantity": 1
        }
      ]
    }
  ]
}
```

#### 2.3 이벤트 상세 조회

```
Endpoint: /event/:eventId
Method: GET
권한: ADMIN, OPERATOR, AUDITOR, USER

요청 (Path Parameter):
- eventId: 682b79db38765ca2e9490750

정상 응답 (200 OK):
{
  "success": true,
  "message": "이벤트가 조회되었습니다.",
  "event": {
    "id": "682b79db38765ca2e9490750",
    "name": "신규 가입자 이벤트",
    "isActive": true,
    "startDate": "2024-03-20T00:00:00Z",
    "endDate": "2024-04-20T23:59:59Z",
    "conditions": [
      {
        "type": "LOGIN_COUNT",
        "count": 5
      },
      {
        "type": "PURCHASE_AMOUNT",
        "amount": 50000
      }
    ],
    "rewards": [
      {
        "type": "POINT",
        "quantity": 1000
      },
      {
        "type": "COUPON",
        "quantity": 1
      }
    ]
  }
}
```

#### 2.4 이벤트 상태 변경

```
Endpoint: /event/:eventId/status
Method: PUT
권한: ADMIN, OPERATOR

요청 (Path Parameter):
- eventId: 682b79db38765ca2e9490750

요청 (Request Body):
{
  "isActive": false
}

정상 응답 (200 OK):
{
  "success": true,
  "message": "이벤트 상태가 변경되었습니다.",
  "event": {
    "id": "682b79db38765ca2e9490750",
    "name": "신규 가입자 이벤트",
    "isActive": false
  }
}
```

### 3. 보상 (Reward)

#### 3.1 보상 목록 조회

```
Endpoint: /event/:eventId/rewards
Method: GET
권한: ADMIN, OPERATOR, AUDITOR, USER

요청 (Path Parameter):
- eventId: 682b79db38765ca2e9490750

정상 응답 (200 OK):
{
  "success": true,
  "message": "보상 목록이 조회되었습니다.",
  "rewards": [
    {
      "type": "POINT",
      "quantity": 1000
    },
    {
      "type": "COUPON",
      "quantity": 1
    }
  ]
}
```

#### 3.2 보상 상세 조회

```
Endpoint: /event/:eventId/reward/:rewardId
Method: GET
권한: ADMIN, OPERATOR, AUDITOR, USER

요청 (Path Parameter):
- eventId: 682b79db38765ca2e9490750
- rewardId: 682b79db38765ca2e9490751

정상 응답 (200 OK):
{
  "success": true,
  "message": "보상이 조회되었습니다.",
  "reward": {
    "type": "POINT",
    "quantity": 1000
  }
}
```

#### 3.3 일반 사용자 보상 요청 내역 조회

```
Endpoint: /user/event/reward/requests
Method: GET
권한: USER

요청 (Request Body):
{
  "userId": "682b79db38765ca2e9490748"
}

정상 응답 (200 OK):
{
  "success": true,
  "message": "보상 요청 내역이 조회되었습니다.",
  "rewardRequests": [
    {
      "userId": "682b79db38765ca2e9490748",
      "participation": {
        "id": "682b79db38765ca2e9490752",
        "status": "COMPLETED",
        "requestedAt": "2024-03-20T10:00:00Z",
        "completedAt": "2024-03-20T10:05:00Z"
      },
      "event": {
        "id": "682b79db38765ca2e9490750",
        "name": "신규 가입자 이벤트",
        "isActive": true,
        "startDate": "2024-03-20T00:00:00Z",
        "endDate": "2024-04-20T23:59:59Z",
        "conditions": [
          {
            "type": "LOGIN_COUNT",
            "count": 5
          },
          {
            "type": "PURCHASE_AMOUNT",
            "amount": 50000
          }
        ]
      },
      "rewards": [
        {
          "type": "POINT",
          "quantity": 1000
        },
        {
          "type": "COUPON",
          "quantity": 1
        }
      ]
    }
  ],
  "total": 1
}
```

#### 3.4 관리자/운영자/감시자 보상 요청 내역 조회

```
Endpoint: /admin/event/reward/requests
Method: GET
권한: ADMIN, OPERATOR, AUDITOR

요청 (Request Body):
{
  "eventId": "682b79db38765ca2e9490750",
  "userId": "682b79db38765ca2e9490748",
  "status": "COMPLETED",
  "startDate": "2024-03-20T00:00:00Z",
  "endDate": "2024-03-21T00:00:00Z"
}

정상 응답 (200 OK):
{
  "success": true,
  "message": "보상 요청 내역이 조회되었습니다.",
  "rewardRequests": [
    {
      "userId": "682b79db38765ca2e9490748",
      "participation": {
        "id": "682b79db38765ca2e9490752",
        "status": "COMPLETED",
        "requestedAt": "2024-03-20T10:00:00Z",
        "completedAt": "2024-03-20T10:05:00Z"
      },
      "event": {
        "id": "682b79db38765ca2e9490750",
        "name": "신규 가입자 이벤트",
        "isActive": true,
        "startDate": "2024-03-20T00:00:00Z",
        "endDate": "2024-04-20T23:59:59Z",
        "conditions": [
          {
            "type": "LOGIN_COUNT",
            "count": 5
          },
          {
            "type": "PURCHASE_AMOUNT",
            "amount": 50000
          }
        ]
      },
      "rewards": [
        {
          "type": "POINT",
          "quantity": 1000
        },
        {
          "type": "COUPON",
          "quantity": 1
        }
      ]
    }
  ],
  "total": 1
}
```

<br>

## 이벤트 시스템 설계

1. 이벤트 구조 및 저장 방식

   - 이벤트는 이름, 조건, 보상으로 구성됨.
   - **조건(EventCondition)** 은 다형성 구조로 설계되어, LOGIN_COUNT, PURCHASE_AMOUNT, REFERRAL_COUNT 등 다양한 유형을 지원하며, 확장성 있는 다형성 구조로 설계.
   - **보상(EventReward)** 도 POINT, COUPON, ITEM 등 여러 형태를 유연하게 포함 가능.
   - 조건과 보상은 중첩된 복합 구조로 저장되어 다양한 이벤트 시나리오를 지원.

2. 조건 검증 방식

   - 각 조건/보상 타입별로 독립적인 검증 로직 존재 (switch-case 기반 분기).
   - 모든 조건을 만족해야만 이벤트 성공 처리 (AND 조건 구조).
   - **이벤트 참여 내역(EventParticipation)** 을 기록해 중복 참여 차단 및 참여 이력 추적.
   - 사용자 권한 검증:
     - JWT 토큰 검증
     - 역할 기반 접근 제어
     - Guards를 통한 엔드포인트 보호

3. 각 역할별 권한 설정

   - USER
     - 이벤트 목록/상세 조회
     - 보상 목록/상세 조회
     - 보상 요청
     - 본인 보상 요청 내역 조회
   - OPERATOR
     - 이벤트 생성/상태 변경
     - 보상 등록/조회
     - 보상 요청 내역 조회
   - AUDITOR
     - 이벤트 목록/상세 조회
     - 보상 목록/상세 조회
     - 보상 요청 내역 조회
   - ADMIN
     - 유저 목록 조회
     - 유저 권한 변경
     - 모든 기능 접근

4. 주요 구현 내용

   - **안전한 데이터 처리**

     - 여러 사용자가 동시에 이벤트에 참여할 때 데이터가 꼬이지 않도록 트랜잭션 처리
     - MongoDB의 세션 기능을 활용해 데이터 일관성 보장
     - 이벤트 참여 시 중복 참여 방지

   - **효율적인 조건 검증**

     - 로그인 횟수, 구매 금액, 추천인 수 등 각각의 조건을 독립적으로 검증
     - 조건별로 최적화된 데이터베이스 쿼리 사용
     - 구매 금액의 경우 합계를 한 번에 계산하는 등 효율적인 처리

   - **확장 가능한 구조**
     - 새로운 이벤트 조건이나 보상 타입을 쉽게 추가할 수 있는 구조
     - 각 조건과 보상이 독립적으로 동작하여 유지보수가 용이
     - 코드의 가독성과 재사용성 향상

## 구현 중 겪은 고민

1. 이벤트 & 쿠폰 설계

   - 다형성 구조 설계의 복잡성
     - 다양한 이벤트 유형을 지원하기 위해 다형성 구조 도입
     - 조건과 보상의 다양한 유형을 처리하기 위해 인터페이스와 추상 클래스 사용
   - 조건 검증 로직의 구현
     - 조건 충족 여부를 판단하는 검증 로직 구현
     - 이벤트 참여 이력 관리
     - 중복 참여를 방지하기 위한 유니크 인덱스 사용
     - 참여 횟수 제한을 위한 카운터 구현

2. DTO 설계
   - 검증 메시지의 일관성 유지
     - 모든 DTO에 동일한 형식의 검증 메시지 사용
     - 에러 메시지를 상수로 관리하여 일관성 유지
   - 페이로드 구조의 단순화
     - 불필요한 중첩 구조 제거
     - 명확한 네이밍 컨벤션 적용
     - 타입 안정성 확보를 위한 인터페이스 정의
   - 응답 형식의 표준화
     - 모든 API 응답에 동일한 형식 적용
     - 에러 응답의 일관된 구조 유지

## 마주친 에러 & 해결 방법

1. HTTP 예외 처리 → 마이크로서비스(RPC) 예외 처리로 전환

   - 기존 HTTP 예외(HttpException)는 마이크로서비스 간 통신에서 적절히 전달되지 않음.
   - 마이크로서비스 간 통신에서는 RpcException을 사용해야 정상적으로 오류가 전달됨.
   - RpcException을 활용하도록 예외 필터를 교체하고, 각 마이크로서비스에서 RpcException을 반환하도록 수정함.

2. 마이크로서비스 환경에서 JWT 인증/인가 처리

   - JwtAuthGuard에서 ExecutionContext의 switchToRpc()를 사용해 메시지 기반 컨텍스트로 전환하도록 변경.
   - 사용자 인증 정보는 메시지 페이로드 내 authorization 필드에서 추출하도록 수정.
   - 게이트웨이 서비스에서 JWT를 headers.authorization 형식이 아닌, payload.authorization로 전달하는 구조로 변경.

3. DTO 직렬화 및 타입 손실 문제 대응

   - NestJS 마이크로서비스 통신 시 DTO 클래스 정보가 런타임에 사라지는 문제 존재.
   - any 타입으로 수신한 뒤 내부에서 DTO 클래스로 수동 변환하거나 유효성 검사 처리하는 방식을 도입.

4. 이벤트 서비스 메시지 진입 실패 → 포트 및 마이크로서비스 리스닝 설정

   - @MessagePattern() 데코레이터가 동작하지 않은 이유는 마이크로서비스가 TCP 서버를 제대로 리스닝하지 않았기 때문.
   - main.ts에서 createMicroservice()를 통한 TCP 서버 생성 및 명시적 .listen() 호출로 문제 해결.
   - Gateway와 이벤트 서비스 간 메시지 패턴(create-event)과 TCP 연결 설정을 재점검하여 정상 통신 확인.

5. Mongoose와 TypeScript 타입 불일치
   - Mongoose Document와 TypeScript 인터페이스 간 타입 불일치 발생
   - 인터페이스 정의와 타입 단언을 통해 해결
   - 스키마 정의 시 타입 안정성 확보

## 알게된 점

1. 게이트웨이 HTTP 엔드포인트와 내부 마이크로서비스의 메시지 패턴

   - @MessagePattern()을 사용하여 내부 통신을 위한 메시지 패턴을 정의.
   - 실제 HTTP 엔드포인트는 Gateway 컨트롤러에서 제공한다.

2. rxjs firstValueFrom

   - Observable을 Promise로 변환하여 비동기 처리 단순화
   - 마이크로서비스 통신에서 유용하게 활용

3. 마이크로서비스 아키텍처의 특성

   - 서비스 간 느슨한 결합
   - 독립적인 배포와 확장
   - 장애 격리와 복원성
   - 분산 시스템의 복잡성 관리

4. 이벤트 & 보상 시스템 설계의 어려움

   - 다양한 이벤트 유형 처리
     - 이벤트 유형별 독립적인 처리 로직
     - 확장 가능한 이벤트 구조 설계
     - 이벤트 유형별 검증 로직 구현
   - 복잡한 조건 검증 로직
     - 조건 조합의 복잡성
     - 조건 우선순위 관리
     - 조건 충족 여부 판단
