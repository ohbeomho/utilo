import { config } from "dotenv";
import path from "path";

config({
  path: path.join(__dirname, ".env")
});

const requiredVars = ["BOT_TOKEN", "APP_ID", "NODE_ENV"];
const env = requiredVars.map((name) => ({ name, value: process.env[name] }));
const undef = env.filter((e) => e.value === undefined);

if (undef.length) {
  console.log(`${undef.map((e) => e.name).join(", ")}이 .env에 정의되어 있지 않습니다.`);
  process.exit(1);
}

export const [BOT_TOKEN, APP_ID, NODE_ENV, VER] = [...env.map((e) => e.value!), "1.0.2"];
