// 10. data/post.mjs (게시글 DB 액세스)

import { db } from "../db/database.mjs";

// 게시글과 작성자 정보를 같이 가져오기 위한 기본 SELECT 구문
const SELECT_JOIN =
  "select p.id, p.text, p.createAt, u.userid, u.name, url from users as u join posts as p on u.idx = p.useridx";

// 정렬 조건 (최신 글이 위로 오게)
const ORDER_DESC = "order by p.createAt desc";
const ORDER_ASC = "order by p.createAt asc";

// 모든 포스트를 리턴
export async function getAll() {
  return db.execute(`${SELECT_JOIN} ${ORDER_DESC}`).then((result) => result[0]);
}

// 특정 userid의 포스트 목록 리턴
export async function getAllByUserid(userid) {
  return db
    .execute(`${SELECT_JOIN} where u.userid=? ${ORDER_DESC}`, [userid])
    .then((result) => result[0]);
}

// 글 번호(id)로 특정 포스트 리턴
export async function getById(id) {
  return db
    .execute(`${SELECT_JOIN} where p.id=?`, [id])
    .then((result) => result[0][0]);
}

// 새 포스트 작성
export async function create(text, idx) {
  return (
    db
      .execute("insert into posts (useridx, text) values (?, ?)", [idx, text])
      // insert 후 insertId로 다시 한번 조회해서
      // 완성된 포스트 객체를 반환
      .then((result) => getById(result[0].insertId))
  );
}

// 포스트 내용 수정
export async function update(id, text) {
  return db
    .execute("update posts set text=? where id=?", [text, id])
    .then(() => getById(id));
}

// 포스트 삭제
export async function remove(id) {
  return db.execute("delete from posts where id=?", [id]);
}

// #-------------------------------------------------------------
// let posts = [
//   {
//     id: "1",
//     name: "김사과",
//     userid: "apple",
//     text: "Node.js 배우는 중인데 Express 진짜 편하다! 🚀",
//     createdAt: Date.now().toString(),
//     url: "https://randomuser.me/api/portraits/women/32.jpg",
//   },
//   {
//     id: "2",
//     name: "오렌지",
//     userid: "orange",
//     text: "오늘의 커피 ☕️ + 코딩 = 최고의 조합!",
//     createdAt: Date.now().toString(),
//     url: "https://randomuser.me/api/portraits/men/44.jpg",
//   },
//   {
//     id: "3",
//     name: "이메론",
//     userid: "melon",
//     text: "Elasticsearch 연동 완료! 실시간 검색 API 짜릿해 🔍",
//     createdAt: Date.now().toString(),
//     url: "https://randomuser.me/api/portraits/men/11.jpg",
//   },
//   {
//     id: "4",
//     name: "반하나",
//     userid: "banana",
//     text: "JavaScript 비동기 너무 어렵다... Promises, async/await, 뭐가 뭔지 😭",
//     createdAt: Date.now().toString(),
//     url: "https://randomuser.me/api/portraits/women/52.jpg",
//   },
//   {
//     id: "5",
//     name: "채리",
//     userid: "cherry",
//     text: "새 프로젝트 시작! Express + MongoDB + EJS 조합 좋아요 💡",
//     createdAt: Date.now().toString(),
//     url: "https://randomuser.me/api/portraits/women/29.jpg",
//   },
// ];
