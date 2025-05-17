export const AppError = {
  USER: {
    NOT_FOUND: {
      code: 404,
      message: '사용자를 찾을 수 없습니다.',
    },
    EMAIL_ALREADY_EXISTS: {
      code: 400,
      message: '이미 등록된 이메일입니다.',
    },
    NAME_ALREADY_EXISTS: {
      code: 400,
      message: '이미 등록된 이름입니다.',
    },
  },
  AUTH: {
    INVALID_TOKEN: {
      code: 401,
      message: '유효하지 않은 토큰입니다.',
    },
    INVALID_CREDENTIALS: {
      code: 401,
      message: '이름 또는 비밀번호가 잘못되었습니다.',
    },
    INVALID_HEADER: {
      code: 401,
      message: '유효하지 않은 헤더입니다.',
    },
    NO_TOKEN: {
      code: 401,
      message: '토큰이 없습니다.',
    },
  },
};
