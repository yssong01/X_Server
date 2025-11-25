// 9. data/auth.mjs (유저 DB 액세스)

// MySQL 연결 객체 (pool.promise())
import { db } from "../db/database.mjs";

// 새 사용자 생성
export async function createUser(user) {
  const { userid, password, name, email, url } = user;

  // users 테이블에 한 행을 INSERT
  return db
    .execute(
      "insert into users (userid, password, name, email, url) values (?, ?, ?, ?, ?)",
      [userid, password, name, email, url]
    )
    .then((result) => result[0].insertId); // 새로 생성된 행의 자동 증가 idx

  // 아래 return user는 실행되지 않음 (위에서 이미 리턴)
  return user;
}

// userid 로 사용자 찾기 (로그인/중복체크에서 사용)
export async function findByUserid(userid) {
  return db
    .execute("select idx, password from users where userid=?", [userid])
    .then((result) => {
      console.log(result);
      return result[0][0]; // 첫 번째 행
    });
}

// idx 로 사용자 찾기 (JWT 인증 후 사용자 확인)
export async function findById(idx) {
  return db
    .execute("select idx, userid from users where idx=?", [idx])
    .then((result) => result[0][0]);
}

// // export async function createUser(userid, password, name, email) {
// export async function createUser(user) {
//   const { userid, password, name, email, url } = user;
//   // const user = {
//   //   id: Date.now().toString(),
//   //   userid,
//   //   password,
//   //   name,
//   //   email,
//   //   url: "https://randomuser.me/api/portraits/men/29.jpg",
//   // };
//   // users = [user, ...users];
//   return db
//     .execute(
//       "insert into users (userid, password, name, email, url) values (?, ?, ?, ?, ?)",
//       [userid, password, name, email, url]
//     )
//     .then((result) => result[0].insertId);
//   return user;
// }

// // export async function login(userid, password) {
// //   const user = users.find(
// //     (user) => user.userid === userid && user.password === password
// //   );
// //   return user;
// // }

// export async function findByUserid(userid) {
//   // const user = users.find((user) => user.userid === userid);
//   // return user;
//   return db
//     .execute("select idx, password from users where userid=?", [userid])
//     .then((result) => {
//       console.log(result);
//       return result[0][0];
//     });
// }

// export async function findById(idx) {
//   return db
//     .execute("select idx, userid from users where idx=?", [idx])
//     .then((result) => result[0][0]);
// }
