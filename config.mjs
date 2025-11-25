// 2. config.mjs (환경 변수 관리)

// dotenv 라이브러리 불러오기
// → .env 파일에 적어둔 환경 변수를 process.env 로 읽어오게 해주는 도구
import dotenv from "dotenv";

// .env 파일을 읽어서 process.env 에 넣어줌
dotenv.config();

// 환경 변수를 읽는 도우미 함수
// - key : 읽고 싶은 환경 변수 이름
// - defaultValue : 값이 없을 때 사용할 기본값(선택)
function required(key, defaultValue = undefined) {
  // process.env[key] 가 있으면 그 값 사용,
  // 없으면 전달받은 defaultValue 사용
  const value = process.env[key] || defaultValue;

  // 값이 완전히 비어있으면(= null 또는 undefined)
  // 에러를 던져서 서버가 잘못된 설정으로 실행되지 않도록 함
  if (value == null) {
    throw new Error(`키 ${key}는 undefined!!`);
  }

  return value;
}

// 전체 설정을 한 곳에 모아둔 config 객체
// 다른 파일에서 import 해서 사용한다.
export const config = {
  // JWT 관련 설정
  jwt: {
    // JWT 서명에 사용할 비밀 키
    secretKey: required("JWT_SECRET"),
    // JWT 만료 시간(초 단위)
    expiresInSec: parseInt(required("JWT_EXPIRES_SEC")),
  },

  // bcrypt(비밀번호 해시) 관련 설정
  bcrypt: {
    // salt 라운드 수 (값이 클수록 더 안전하지만 더 느림)
    saltRounds: parseInt(required("BCRYPT_SALT_ROUNDS", 12)),
  },

  // 서버(host) 관련 설정
  host: {
    // 서버가 사용할 포트 번호
    // .env 에 HOST_PORT가 없으면 기본값 9090 사용
    port: parseInt(required("HOST_PORT", 9090)),
  },

  // DB(MySQL) 접속 관련 설정
  db: {
    host: required("DB_HOST"),
    user: required("DB_USER"),
    password: required("DB_PASSWORD"),
    database: required("DB_DATABASE"),
    port: required("DB_PORT"),
  },
};
