// 3. router/auth.mjs (회원가입/로그인 라우터)

// Express에서 라우터 기능을 사용하기 위해 import
import express from "express";

// 실제 로직을 수행하는 컨트롤러 함수들 (signup, login, me)
import * as authController from "../controller/auth.mjs";

// 요청 바디의 값을 검증하기 위한 express-validator 모듈
// body("필드명") 으로 검증 규칙을 정의할 수 있다.
import { body } from "express-validator";

// 검증 결과를 확인하고 에러를 처리하는 공통 미들웨어
import { validate } from "../middleware/validator.mjs";

// JWT 토큰을 검사해서 로그인 여부를 확인하는 미들웨어
import { isAuth } from "../middleware/auth.mjs";

// 라우터 객체 생성
const router = express.Router();

// 로그인 입력값 검증 규칙 배열
const validateLogin = [
  // userid 필드 검증
  body("userid")
    .trim() // 앞뒤 공백 제거
    .isLength({ min: 4 }) // 최소 길이 4
    .withMessage("최소 4자이상 입력")
    .matches(/^[a-zA-Z0-9]+$/) // 영어, 숫자만 허용
    .withMessage("특수문자 사용불가"),

  // password 필드 검증
  body("password").trim().isLength({ min: 4 }).withMessage("최소 4자이상 입력"),

  // 위에서 정의한 규칙들의 결과를 확인하는 공통 미들웨어
  validate,
];

// 회원가입 입력값 검증 규칙 배열
const validateSignup = [
  // 로그인 검증 규칙들을 그대로 재사용
  ...validateLogin,

  // name 필드는 비어 있으면 안 됨
  body("name").trim().notEmpty().withMessage("name을 입력"),

  // email 필드는 이메일 형식이어야 함
  body("email").trim().isEmail().withMessage("이메일 형식 확인"),

  validate,
];

// 회원 가입
// POST /auth/signup
router.post("/signup", validateSignup, authController.signup);

// 로그인
// POST /auth/login
router.post("/login", validateLogin, authController.login);

// 로그인 유지/현재 사용자 정보 확인
// POST /auth/me  (헤더에 JWT 필요)
router.post("/me", isAuth, authController.me);

// 이 파일에서 router 를 기본 export
export default router;
