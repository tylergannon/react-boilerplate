import express from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
// import favicon from 'serve-favicon';
// import { compose } from 'compose-middleware';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
// import routes from './routes/index';
// import users from './routes/users';
import User from '../model/user';

const Router = express.Router();

const SECRET = 'HELLA';
const ONE_HOUR = 60 * 60;
const ACCESS_TOKEN = 'access-token';

// uncomment after placing your favicon in /public
// Router.use(favicon(__dirname + '/public/favicon.ico'));

Router.use(logger('dev'));
Router.use(bodyParser.json());
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(cookieParser());
Router.use(expressSession({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}));
Router.use(passport.initialize());
Router.use(passport.session());
Router.use(express.static(path.join(__dirname, 'public')));

function makeNewToken(user, exp = ONE_HOUR) {
  const expiry = Math.floor(Date.now() / 1000) * exp;
  const token = jwt.sign({
    data: user.email,
    exp: expiry,
  }, SECRET);
  return {
    [ACCESS_TOKEN]: token,
    expiry,
    uid: user.email,
    client: 'default',
  };
}

async function bearerStrategyFinder(token, cb) {
  try {
    const user = await User.findOne({ email: await jwt.verify(token, SECRET) }).exec();
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

passport.use(new LocalStrategy(User.authenticate()));
passport.use(new BearerStrategy(bearerStrategyFinder));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect('mongodb://localhost/polestar');

const bearerAuth = passport.authenticate('bearer', { session: false });
const localAuth = passport.authenticate('local', { session: false });

// function renewToken(req, res, next) {
//   if (req.user && req.user.newToken) {
//     Object.entries(req.user.newToken, (header) => {
//       res.set(...header);
//     });
//   }

//   next();
// }

// const authenticateAndRenewToken = compose(bearerAuth, renewToken);

// catch 404 and forward to error handler
const ENDPOINTS = {
  apiUrl: '/api',
  signOutPath: '/sign_out',
  emailSignInPath: '/sign_in',
  emailRegistrationPath: '/',
  accountUpdatePath: '/',
  accountDeletePath: '/',
  passwordResetPath: '/password',
  passwordUpdatePath: '/password',
  tokenValidationPath: '/validate_token',

  authProviderPaths: {
    github: '/github',
    facebook: '/facebook',
    google: '/google_oauth2',
  },
};

async function emailRegistration(req, res) {
  const user = new User({ email: req.body.email });
  await user.setPassword(req.body.password);
  await User.create(req.body);

  res.json({
    status: 'success',
  });
}

async function accountDelete(req, res) {
  await User.deleteOne({ email: req.user.email }).exec();
  res.json({
    message: 'Account deleted.',
    status: 'success',
  });
}

async function emailSignIn(req, res) {
  res.doStufff();
}

Router.route(ENDPOINTS.emailRegistrationPath).post(emailRegistration)
                     .delete(accountDelete, bearerAuth);

Router.route(ENDPOINTS.emailSignInPath).post(localAuth, emailSignIn);

Router.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (Router.get('env') === 'development') {
  Router.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
Router.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});


export default Router;
