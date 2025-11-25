// 5. middleware/auth.mjs (JWT 인증 미들웨어)

// JWT(JSON Web Token)를 만들고 검증하는 라이브러리
import jwt from "jsonwebtoken";

// DB에서 사용자 정보를 읽어오는 모듈
import * as authRepository from "../data/auth.mjs";

// 환경 설정 (JWT 시크릿키 등)
import { config } from "../config.mjs";

// 공통 에러 메시지 객체
const AUTH_ERROR = { message: "인증 에러" };

// 로그인 여부를 확인하는 미들웨어
export const isAuth = async (req, res, next) => {
  // 요청 헤더 중 'Authorization' 값을 읽어옴
  // 예: "Bearer asdfasdfasdf..."
  const authHeader = req.get("Authorization");
  console.log(authHeader);

  // // 헤더가 없거나, 'Bearer ' 로 시작하지 않으면 에러
  // if (!(authHeader && authHeader.startsWith("Bearer "))) {
  //   console.log("헤더 에러");
  //   return res.status(401).json(AUTH_ERROR);
  // }

  // Authorization:Bearer QEWRASDFDSAFSADFASDFD==
  // "Bearer 토큰값" 에서 토큰 문자열만 추출
  const token = authHeader.split(" ")[1];
  // console.log("토큰 분리 성공", token);

  // 토큰이 유효한지 확인 (서명 + 만료시간 체크)
  jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
    if (error) {
      console.log("토큰 에러");
      return res.status(401).json(AUTH_ERROR);
    }

    // decoded에는 토큰을 만들 때 넣었던 payload가 들어있음
    // 여기서는 { idx: 사용자번호 } 가 들어있다.
    console.log(decoded);

    // 토큰의 idx로 실제 DB에서 사용자 정보를 조회
    const user = await authRepository.findById(decoded.idx);
    if (!user) {
      console.log("아이디 없음");
      return res.status(401).json(AUTH_ERROR);
    }

    console.log("user.id: ", user.idx);
    console.log("user.userid: ", user.userid);

    // 이후 컨트롤러에서 쓸 수 있도록
    // 요청 객체(req)에 현재 사용자 idx를 기록
    req.idx = user.idx;

    // 다음 미들웨어 또는 컨트롤러로 진행
    next();
  });
};
