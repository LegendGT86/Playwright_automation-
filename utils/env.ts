import * as dotenv from "dotenv";
dotenv.config();

export const ENV = {
  baseUrl: process.env.BASE_URL!,
  username: process.env.USERNAME!,
  password: process.env.PASSWORD!,
};
