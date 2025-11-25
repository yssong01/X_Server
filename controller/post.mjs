// 8. controller/post.mjs (게시글 컨트롤러)

// 포스트 관련 DB 작업 함수들
import * as postRepository from "../data/post.mjs";

// 모든 포스트를 가져오는 함수
export async function getPosts(req, res, next) {
  // 쿼리스트링으로 전달된 userid (옵션)
  const userid = req.query.userid;

  // userid 가 있으면 해당 사용자의 글만, 없으면 전체 글
  const data = await (userid
    ? postRepository.getAllByUserid(userid)
    : postRepository.getAll());

  res.status(200).json(data);
}

// 하나의 포스트를 가져오는 함수
export async function getPost(req, res, next) {
  // URL 파라미터에서 id값 읽기 (/post/:id)
  const id = req.params.id;

  const post = await postRepository.getById(id);
  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404).json({ message: `${id}의 포스트가 없습니다` });
  }
}

// 포스트를 작성하는 함수
export async function createPost(req, res, next) {
  // const { userid, name, text } = req.body;
  const { text } = req.body;

  // isAuth 미들웨어에서 넣어준 현재 사용자 idx
  console.log("req.idx: ", req.idx);

  // DB에 글을 저장 (작성자: req.idx, 내용: text)
  const post = await postRepository.create(text, req.idx);

  res.status(201).json(post);
}

// 포스트를 변경하는 함수
export async function updatePost(req, res, next) {
  const id = req.params.id;
  const text = req.body.text;

  const post = await postRepository.update(id, text);
  if (post) {
    res.status(201).json(post);
  } else {
    res.status(404).json({ message: `${id}의 포스트가 없습니다` });
  }
}

// 포스트를 삭제하는 함수
export async function deletePost(req, res, next) {
  const id = req.params.id;
  await postRepository.remove(id);
  res.sendStatus(204); // 성공했지만 돌려줄 데이터는 없음
}
