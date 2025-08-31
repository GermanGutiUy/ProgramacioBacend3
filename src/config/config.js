import dotenv from 'dotenv';
dotenv.config();


export const config = {
PORT: process.env.PORT || 8080,
MONGO_URI: process.env.MONGO_URI,
JWT_SECRET: process.env.JWT_SECRET,
JWT_EXPIRES: process.env.JWT_EXPIRES || '1h',
NODE_ENV: process.env.NODE_ENV || 'development',
COOKIE_NAME: process.env.COOKIE_NAME || 'token',
};