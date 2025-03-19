import jwt from "jsonwebtoken";
import { config } from "../../config";

const { JSON_SECRET, SESSION_DURATION_HOURS } = config;

const createToken = (content: any, secret: string, expiresMinutes?: number) => {
  const options: jwt.SignOptions = {};

  if (expiresMinutes) options.expiresIn = `${expiresMinutes}m`;

  return jwt.sign(content, secret, options);
};

const createUserSessionToken = (content: any) => {
  const sessionDuration = SESSION_DURATION_HOURS * 60 + 1

  return createToken(content, JSON_SECRET, sessionDuration)
}

const validateToken = (token: string, secret: string, ignoreExpiration = false) => {
  return jwt.verify(token, secret, { ignoreExpiration });
};

export { createToken, createUserSessionToken, validateToken };
