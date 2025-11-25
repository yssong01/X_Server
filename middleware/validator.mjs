// 6. middleware/validator.mjs (입력 검증 결과 처리)

// express-validator에서 검증 결과를 모아주는 함수
import { validationResult } from "express-validator";

// 앞에서 정의한 body("...") 규칙들의 결과를 확인하고,
// 에러가 있으면 응답을 보내고, 없으면 다음으로 넘겨주는 미들웨어
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  // 에러가 없다면 다음 미들웨어/컨트롤러로 진행
  if (errors.isEmpty()) {
    return next();
  }

  // 에러가 있다면 첫 번째 에러 메시지만 응답으로 보냄
  return res.status(400).json({ message: errors.array()[0].msg });
};