import jwt from 'jsonwebtoken';
import redis from 'redis';
import { promisify } from 'util';
import User from '../../model/user';

const ONE_HOUR = 60 * 60;
const SECRET = 'HELLA';
const THRESHOLD = 5;
export const ACCESS_TOKEN = 'access-token';


// 1. Verifies that the token is valid.
// 2. If the token is not included on the user
export async function validateToken(token) {
  const redisClient = redis.createClient();
  redisClient.getAsync = promisify(redisClient.get).bind(redisClient);
  const tokenData = jwt.verify(token, SECRET);
  const user = await User.findOne({ username: tokenData.data.uid }).exec();
  if (user.tokens.includes(token)) {
    const response = makeNewToken(user);
    const newToken = response[ACCESS_TOKEN];
    User.replaceToken(user, { oldToken: token, newToken });
    redisClient.setex(token, THRESHOLD, 2);
    return response;
  } else if (await redisClient.getAsync(token)) {
    const response = makeNewToken(user);
    User.addToken(user, { newToken: response[ACCESS_TOKEN] });
    return response;
  }

  return false;
}

export function unpackToken(token) {
  return jwt.verify(token, SECRET);
}

export function makeNewToken(user, exp = ONE_HOUR) {
  const expiry = Math.floor(Date.now() / 1000) + exp;
  const token = jwt.sign({
    data: {
      uid: user.username,
      i: Date.now(),
    },
    exp: expiry,
  }, SECRET);
  return {
    [ACCESS_TOKEN]: token,
    expiry,
    uid: user.username,
    client: 'default',
  };
}

export async function bearerStrategyFinder(token, cb) {
  try {
    const user = await User.findOne({ username: unpackToken(token) }).exec();
    user.tokens = user.tokens.filter((t) => t !== token);
    const newToken = makeNewToken(user);
    user.tokens.push(newToken[ACCESS_TOKEN]);
    user.save().exec();
    user.newToken = newToken;

    cb(null, user);
  } catch (errors) {
    cb(errors);
  }
}