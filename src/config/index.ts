import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL as string,
  ENCRYPT_SALT: 10,
  SESSION_DURATION_HOURS: 10,
  JSON_SECRET: process.env.JSON_SECRET as string,
  CORS_DOMAINS: process.env.CORS_DOMAINS as string,
  SOURCE_EMAIL: process.env.SOURCE_EMAIL as string,
  URL_FRONT_RESET_PASSWORD: process.env.URL_FRONT_RESET_PASSWORD as string,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY as string,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID as string,
  AWS_REGION: process.env.AWS_REGION as string,
  BUCKET_NAME: process.env.BUCKET_NAME as string,
  CONSOLE_DATA_URL: process.env.CONSOLE_DATA_URL as string,
  CERTIFICATE_KEY: process.env.CERTIFICATE_KEY as string,
  CERTIFICATE_CERT: process.env.CERTIFICATE_CERT as string,
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN as string,
};

export { config };
