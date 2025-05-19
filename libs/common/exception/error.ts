export const AppError = {
  USER: {
    NOT_FOUND: {
      code: 404,
      message: '사용자를 찾을 수 없습니다.',
    },
    EMAIL_ALREADY_EXISTS: {
      code: 400,
      message: '이미 존재하는 이메일입니다.',
    },
    NAME_ALREADY_EXISTS: {
      code: 400,
      message: '이미 존재하는 이름입니다.',
    },
    GET_USERS_FAILED: {
      code: 500,
      message: '사용자 목록 조회에 실패했습니다.',
    },
  },
  AUTH: {
    INVALID_TOKEN: {
      code: 401,
      message: '유효하지 않은 토큰입니다.',
    },
    INVALID_CREDENTIALS: {
      code: 401,
      message: '유효하지 않은 인증 정보입니다.',
    },
    INVALID_HEADER: {
      code: 401,
      message: '유효하지 않은 인증 헤더입니다.',
    },
    NO_TOKEN: {
      code: 401,
      message: '인증 토큰이 필요합니다.',
    },
    ADMIN_ONLY: {
      code: 403,
      message: '관리자만 접근할 수 있습니다.',
    },
    FORBIDDEN: {
      code: 403,
      message: '권한이 없습니다.',
    },
  },
  EVENT: {
    CONDITION: {
      INVALID_TYPE: {
        code: 400,
        message: '유효하지 않은 이벤트 조건 타입입니다.',
      },
      NOT_MET: {
        code: 400,
        message: '이벤트 조건을 충족하지 않았습니다.',
      },
    },
    NOT_IN_PERIOD: {
      code: 400,
      message: '이벤트 기간이 아닙니다.',
    },
    CREATE_FAILED: {
      code: 500,
      message: '이벤트 생성에 실패했습니다.',
    },
    CHECK_PARTICIPATION_FAILED: {
      code: 500,
      message: '이벤트 참여 확인에 실패했습니다.',
    },
    NOT_FOUND: {
      code: 404,
      message: '이벤트를 찾을 수 없습니다.',
    },
    NOT_ACTIVE: {
      code: 400,
      message: '이벤트가 활성화되지 않았습니다.',
    },
    GET_EVENTS_FAILED: {
      code: 500,
      message: '이벤트 목록 조회에 실패했습니다.',
    },
    GET_EVENT_FAILED: {
      code: 500,
      message: '이벤트 상세 조회에 실패했습니다.',
    },
    UPDATE_STATUS_FAILED: {
      code: 500,
      message: '이벤트 상태 변경에 실패했습니다.',
    },
    ALREADY_COMPLETED: {
      code: 400,
      message: '이미 완료된 이벤트입니다.',
    },
    ALREADY_PARTICIPATED: {
      code: 400,
      message: '이미 참여한 이벤트입니다.',
    },
    COUPON: {
      NOT_FOUND: {
        code: 404,
        message: '쿠폰을 찾을 수 없습니다.',
      },
    },
    POINT: {
      NOT_FOUND: {
        code: 404,
        message: '포인트를 찾을 수 없습니다.',
      },
    },
    ITEM: {
      NOT_FOUND: {
        code: 404,
        message: '아이템을 찾을 수 없습니다.',
      },
    },
    REWARD: {
      NOT_FOUND: {
        code: 404,
        message: '보상을 찾을 수 없습니다.',
      },
      CREATE_FAILED: {
        code: 500,
        message: '보상 등록에 실패했습니다.',
      },
      GET_FAILED: {
        code: 500,
        message: '보상 조회에 실패했습니다.',
      },
      GET_REQUESTS_FAILED: {
        code: 500,
        message: '보상 요청 내역 조회에 실패했습니다.',
      },
      INVALID_TYPE: {
        code: 400,
        message: '유효하지 않은 보상 타입입니다.',
      },
      PROCESS_FAILED: {
        code: 500,
        message: '보상 지급 처리에 실패했습니다.',
      },
    },
  },
} as const;
