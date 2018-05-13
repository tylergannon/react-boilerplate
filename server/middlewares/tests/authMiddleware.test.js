import request from 'supertest';
import casual from 'casual';
import app from '../../app';
import User from '../../../server/model/user';

function newUser() {
  return {
    email: casual.email,
    password: 'sourdough',
  };
}

async function createUser() {
  const user = new User({ username: casual.email });
  await user.setPassword('sourdough');
  await user.save();
  return user;
}

describe('Auth routes', () => {
  describe('POST /auth', () => {
    it('responds with 200', async () => {
      const response = await request(app).post('/api/auth').send(newUser());
      await expect(response.statusCode).toBe(200);
    });
    describe('When validation fails', () => {
      describe('Because email is taken', () => {
        it('Responds with 422', async () => {
          const theUser = newUser();
          await request(app).post('/api/auth')
                            .send(theUser).expect(200);
          await request(app).post('/api/auth')
                            .send(theUser).expect(422);
        });
      });
    });
  });

  describe('Register and log in', () => {
    const theUser = newUser();
    it('responds with 200', async () => {
      const response = await request(app).post('/api/auth').send(theUser);
      await expect(response.statusCode).toBe(200);
    });

    it('can log the user in', async () => {
      const response = await request(app).post('/api/auth/sign_in')
                                         .send(theUser)
                                         .expect(200)
                                         .expect('access-token', /[\w\d]+/)
                                         .expect('client', 'default')
                                         .expect('uid', /[\w\d]+/)
                                         .expect('expiry', /\d+/);
      const token = response.headers['access-token'];
      const userObject = await User.findOne({ username: theUser.email }).exec();
      await expect(userObject.tokens).toContain(token);
      await expect(response.statusCode).toBe(200);
    });
  });

  describe('POST /auth/sign_in', () => {
    describe('with nonexistent email', () => {
      it('responds with 401', async () => {
        await request(app).post('/api/auth/sign_in')
        .send({ email: casual.email, password: 'sourdough' })
        .expect(401);
      });
    });

    describe('with bad password', () => {
      it('responds with 401', async () => {
        const user = await createUser();
        await request(app).post('/api/auth/sign_in')
        .send({ email: user.username, password: 'blarth' })
        .expect(401);
      });
    });
  });
});
