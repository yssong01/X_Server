import MongoDB from "mongodb";
import { useVirtualId } from "../db/database.mjs";
import mongoose from "mongoose";

// versionKey: mongoose가 문서를 저장할 때 자동으로 추가하는 _v라는 필드를 설명
const userSchema = new mongoose.Schema(
  {
    userid: { type: String, require: true },
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    url: String,
  },
  { versionKey: false } // 버전키를 굳이 사용할 필요가 없어서 false로 둠.
);

useVirtualId(userSchema);
const User = mongoose.model("User", userSchema);
// 단수 user로 써야함. users로 쓰면 안됨.

export async function createUser(user) {
  return new User(user).save().then((data) => data.id);
}

export async function findByUserid(userid) {
  return User.findOne({ userid });
}

export async function findById(id) {
  return User.findById(id);
}
