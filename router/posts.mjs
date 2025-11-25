// 4. router/posts.mjs (게시글 라우터)

import express from "express";

// 실제 글 관련 로직을 수행하는 컨트롤러
import * as postController from "../controller/post.mjs";

// 바디 검증용
import { body } from "express-validator";

//설치-> C:\yssong\X\Server>npm i express-validator
//참고 https://express-validator.github.io/docs

// 검증 결과 확인용 공통 미들웨어
import { validate } from "../middleware/validator.mjs";

// 로그인(인증) 확인용 미들웨어
import { isAuth } from "../middleware/auth.mjs";

// 라우터 생성
const router = express.Router();

// 게시글 내용(text) 검증 규칙
const validatePost = [
  body("text").trim().isLength({ min: 4 }).withMessage("최소 4자이상 입력"),
  validate,
];

// http://127.0.0.1:8000/post
// http://127.0.0.1:8000/post?userid=XXX
// 전체 포스트 가져오기 / 특정 userid의 포스트 가져오기
// GET /post          → 전체
// GET /post?userid=xxx → 특정 사용자 글만
router.get("/", isAuth, postController.getPosts);

// http://127.0.0.1:8000/post/:id
// 글 번호(id)에 대한 포스트 가져오기
// GET /post/:id
router.get("/:id", isAuth, postController.getPost);

// http://127.0.0.1:8000/post/
// 포스트 쓰기
// POST /post
router.post("/", isAuth, validatePost, postController.createPost);

// http://127.0.0.1:8000/post/:id
// 포스트 수정
// PUT /post/:id
router.put("/:id", isAuth, validatePost, postController.updatePost);

// http://127.0.0.1:8000/post/:id
// 포스트 삭제
// DELETE /post/:id
router.delete("/:id", isAuth, postController.deletePost);

export default router;
