import * as dotenv from 'dotenv';

dotenv.config();

export const PORT: number = parseInt(process.env.PORT!);
export const DB_PORT: number = parseInt(process.env.DB_PORT!);
export const {
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_NAME,
  JWT_SECRET,
  NODE_ENV
} = process.env;
