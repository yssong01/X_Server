// 1. app.mjs (서버 입구)

//이전 것 전체 설치-> C:\yssong\X\Server>npm i

// Express 라이브러리를 불러온다.
// → Node.js에서 웹서버를 쉽게 만들 수 있게 해주는 프레임워크
import express from "express";

// 게시글 관련 라우터 ( /post 로 시작하는 요청 처리 담당 )
import postsRouter from "./router/posts.mjs";

// 인증(회원가입, 로그인) 관련 라우터 ( /auth 로 시작하는 요청 처리 담당 )
import authRouter from "./router/auth.mjs";

// 환경 설정(포트, JWT 시크릿키, DB 정보 등)을 모아놓은 객체
import { config } from "./config.mjs";
// import { db } from "./db/database.mjs";  // DB 연결 테스트용 (현재는 주석)

// Express 앱(서버) 객체를 생성
const app = express();

// 들어오는 요청의 body가 JSON 형식일 때,
// 자동으로 파싱해서 req.body에 넣어주는 미들웨어
app.use(express.json());

// '/post' 로 시작하는 요청은 postsRouter에게 맡긴다.
// 예: GET /post, POST /post, GET /post/1 ...
app.use("/post", postsRouter);

// '/auth' 로 시작하는 요청은 authRouter에게 맡긴다.
// 예: POST /auth/login, POST /auth/signup ...
app.use("/auth", authRouter);

// 위의 라우터들 중 어느 것도 일치하지 않으면 여기로 떨어진다.
// → 404 Not Found 응답을 보냄
app.use((req, res, next) => {
  res.sendStatus(404);
});

// DB 연결이 잘 되는지 테스트할 때 사용하던 코드 (지금은 주석 처리)
// db.getConnection().then((connection) => console.log(connection));

// 서버를 시작한다.
// config.host.port 는 .env 에서 가져온 HOST_PORT 값이다.
// 예: 8000 포트에서 서버 실행
// 나는 앞으로 8000번으로 할 것. 8080은 충돌 나고 있음. 오라클이 이미 설치되어있어서?
// 설정 파일(config.mjs)의 host.port 로 서버 실행
app.listen(config.host.port, () => {
  console.log("서버 실행중!");
});
