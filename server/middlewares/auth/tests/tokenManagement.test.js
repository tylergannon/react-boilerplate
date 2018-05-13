import casual from 'casual';
// import fromJS from 'immutable';
import { makeNewToken, unpackToken, validateToken } from '../tokenManagement';
import User from '../../../model/user';

import('../../../app');

const ACCESS_TOKEN = 'access-token';

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
        it('moves the token into the usedTokens array', async () => {
          user = await createUser();
          tokenData = makeNewToken(user);
          token = tokenData[ACCESS_TOKEN];
          user.tokens.push(token);
          await user.save();
          expect(await validateToken(token)).toBeTruthy();
          user = await User.findOne({ username: user.username }).exec();
          expect(user.tokens).not.toContain(token);
          expect(user.usedTokens.length).toEqual(1);
        });
      });

      describe('"usedTokens" list', () => {
        async function setUpForUsedTokens(usedAtTimeRelativeToNow = 0) {
          user = await createUser();
          tokenData = makeNewToken(user);
          token = tokenData[ACCESS_TOKEN];
          user.usedTokens.push({
            usedAt: (Date.now() + usedAtTimeRelativeToNow),
            token: tokenData[ACCESS_TOKEN],
          });
          await user.save();
        }
        describe('within threshold usable time', () => {
          it('returns a new token and does not change the usedTokens list.', async () => {
            await setUpForUsedTokens();
            expect(await validateToken(token)).toBeTruthy();
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
