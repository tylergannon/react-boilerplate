import casual from 'casual';
import redis from 'redis';
import { promisify } from 'util';

// import fromJS from 'immutable';
import { makeNewToken, unpackToken, validateToken } from '../tokenManagement';
import User from '../../../model/user';
const redisClient = redis.createClient();
redisClient.getAsync = promisify(redisClient.get).bind(redisClient);
redisClient.setexAsync = promisify(redisClient.setex).bind(redisClient);

import('../../../app');

const ACCESS_TOKEN = 'access-token';

async function sleep(ms = 500) {
  return new Promise((r) => setTimeout(r, ms));
}

async function createUser() {
  try {
    const user = new User({ username: casual.email });
    await user.setPassword('sourdough');
    await user.save();
    return user;
  } catch (errors) {
    return false;
  }
}

describe('Token Validation', () => {
  let user;
  let token;
  let tokenData;
  let newToken;

  async function setUp() {
    user = await createUser();
    tokenData = makeNewToken(user);
    token = tokenData[ACCESS_TOKEN];
    newToken = await validateToken(tokenData[ACCESS_TOKEN]);
  }
  describe('validateToken', () => {
    describe('when the token is valid', () => {
      describe('token not listed on user record', () => {
        it('returns false', async () => {
          await setUp();
          expect(newToken).toBe(false);
        });
      });
      describe('"tokens" list', () => {
        it('returns a new token', async () => {
          await setUp();
          expect(newToken[ACCESS_TOKEN]).not.toEqual(token);
        });
        it('removes old token from user adds it to redis', async () => {
          user = await createUser();
          tokenData = makeNewToken(user);
          token = tokenData[ACCESS_TOKEN];
          user.tokens.push(token);
          await user.save();
          expect(await validateToken(token)).toBeTruthy();
          user = await User.findOne({ username: user.username }).exec();
          expect(user.tokens).not.toContain(token);
          expect(await redisClient.getAsync(token)).toBeTruthy();
        });
      });

      describe('"usedTokens" list', () => {
        async function setUpForUsedTokens() {
          user = await createUser();
          tokenData = makeNewToken(user);
          token = tokenData[ACCESS_TOKEN];
          await user.save();
        }
        describe('within threshold usable time', () => {
          it('returns a new token and does not change the usedTokens list.', async () => {
            await setUpForUsedTokens();
            await redisClient.setexAsync(token, 5, 2);
            const newTokenData = await validateToken(token);
            expect(newTokenData).toBeTruthy();
            await sleep();
            user = await User.findOne({ username: user.username }).exec();
            expect(user.tokens).toContain(newTokenData[ACCESS_TOKEN]);
          });
        });
        describe('outside threshold', () => {

        });
      });
    });
    describe('when the token is invalid', () => {

    });
  });
});

describe('Token contents', () => {
  it('has username in it', async () => {
    try {
      const user = await createUser();
      const token = makeNewToken(user);
      const unpackedToken = unpackToken(token[ACCESS_TOKEN]);
      expect(unpackedToken.data.uid).toEqual(user.username);
    } catch (errors) {
      expect(true).toBe(false);
    }
  });
});

describe('Token verification', () => {
  const ONE_HOUR_AGO = -60 * 60;
  it('throws an error when token is expired', async () => {
    const user = await createUser();
    const tokenData = makeNewToken(user, ONE_HOUR_AGO);
    expect(() => unpackToken(tokenData['access-token']))
          .toThrow();
  });
});
