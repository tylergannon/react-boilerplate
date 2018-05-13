import User from '../../model/user';
import { makeNewToken, ACCESS_TOKEN } from './tokenManagement';

export async function emailRegistration(req, res) {
  const user = new User({ username: req.body.email });
  try {
    await user.setPassword(req.body.password);
    await user.save();
    res.json({
      status: 'success',
    });
  } catch (errors) {
    res.status(422);
    res.json({
      status: 'error',
      errors,
    });
  }
}

export async function accountDelete(req, res) {
  await User.deleteOne({ email: req.user.email }).exec();
  res.json({
    message: 'Account deleted.',
    status: 'success',
  });
}

export async function emailSignIn(req, res) {
  const user = req.user;
  const tokenData = makeNewToken(user);

  user.tokens.push(tokenData[ACCESS_TOKEN]);
  user.save();

  Object.entries(tokenData).forEach((entry) => res.set(...entry));

  res.json({ data: {
    uid: req.user.username,
    provider: 'email',
    email: req.user.username,
  } });
}
