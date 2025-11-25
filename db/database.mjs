// 11. db/database.mjs (MySQL 연결 설정)

// mysql2 : Node.js에서 MySQL에 접속하기 위한 라이브러리
import mysql from "mysql2";

// DB 접속 정보는 config.mjs 에서 가져온다.
import { config } from "../config.mjs";

// 커넥션 풀 생성
// 여러 요청이 동시에 들어와도 효율적으로 DB 연결을 공유하기 위한 구조
const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  database: config.db.database,
  password: config.db.password,
});

// mysql2는 기본적으로 콜백 스타일인데,
// promise() 를 붙이면 async/await 로 사용 가능해진다.
export const db = pool.promise();
