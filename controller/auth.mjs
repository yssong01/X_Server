// 7. controller/auth.mjs (회원가입/로그인 컨트롤러)

// (현재는 사용 안 하지만) 필요하면 Express 관련 타입이나 기능을 사용할 수 있음
import express from "express";

// 유저 관련 DB 작업 함수들
import * as authRepository from "../data/auth.mjs";

// bcrypt : 비밀번호를 안전하게 해시/비교하는 라이브러리
import * as bcrypt from "bcrypt";

// JWT 생성 라이브러리
import jwt from "jsonwebtoken";

// 환경 설정 (jwt, bcrypt, host, db 등)
import { config } from "../config.mjs";

// JWT 토큰을 만들어주는 헬퍼 함수
async function createJwtToken(idx) {
  // payload에 { idx } 를 담고,
  // 시크릿 키와 만료시간을 사용하여 서명된 토큰 생성
  return jwt.sign({ idx }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}

// 회원가입 처리
export async function signup(req, res, next) {
  // 클라이언트가 보낸 body 데이터 구조 분해
  const { userid, password, name, email, url } = req.body;

  // 1. userid 중복 체크
  const found = await authRepository.findByUserid(userid);
  if (found) {
    return res.status(409).json({ message: `${userid}이 이미 있습니다` });
  }

  // 2. 비밀번호를 bcrypt 로 해시 (암호화)
  const hashed = bcrypt.hashSync(password, config.bcrypt.saltRounds);

  // 3. DB에 유저 정보 저장
  const user = await authRepository.createUser({
    userid,
    password: hashed,
    name,
    email,
    url,
  });

  // createUser가 insertId를 반환하므로,
  // 실제로는 insertId를 받아서 토큰을 만드는 것이 더 정확하다.
  const token = await createJwtToken(user.id);
  console.log(token);

  // 4. 생성된 토큰과 유저 정보를 클라이언트에 돌려줌
  res.status(201).json({ token, user });
}

// 로그인 처리
export async function login(req, res, next) {
  const { userid, password } = req.body;

  // 1. userid로 유저 조회 (회원 중복 조회)
  const user = await authRepository.findByUserid(userid);
  if (!user) {
    return res.status(401).json(`${userid} 를 찾을 수 없음`);
  }

  // 2. 입력한 비밀번호와 DB에 저장된 해시된 비밀번호를 비교
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: `아이디 또는 비밀번호 확인` });
  }

  // 3. 로그인 성공 → JWT 토큰 발급
  const token = await createJwtToken(user.idx);

  // 4. 토큰 + 사용자 정보 반환
  res.status(200).json({ token, user });
}

// 현재 로그인한 사용자 정보(me) 조회
export async function me(req, res, next) {
  // isAuth 미들웨어에서 req.idx 에 넣어둔 값 사용
  const user = await authRepository.findById(req.idx);

  if (!user) {
    return res.status(404).json({ message: "일치하는 사용자가 없음" });
  }

  // req.token 은 현재 코드에서 따로 설정하고 있진 않지만,
  // 필요하다면 isAuth 에서 req.token = token 식으로 넣어줄 수 있다.
  res.status(200).json({ token: req.token, userid: user.idx });
}
