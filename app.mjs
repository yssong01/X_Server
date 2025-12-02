//이전 것 전체 설치-> C:\yssong\X\Server>npm i

import express from "express";
import postsRouter from "./router/posts.mjs";
import authRouter from "./router/auth.mjs";
import { config } from "./config.mjs";
import { connectDB } from "./db/database.mjs";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/post", postsRouter);
app.use("/auth", authRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});

connectDB()
  .then(() => {
    app.listen(config.host.port);
  })
  .catch(console.error);



  
// // 나는 앞으로 8000번으로 할 것. 8080은 충돌 나고 있음. 오라클이 이미 설치되어있어서?
// app.listen(config.host.port, () => {
//   console.log("서버 실행중!");
// });
