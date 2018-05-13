import express from 'express';
import path from 'path';
// import favicon from 'serve-favicon';
// import { compose } from 'compose-middleware';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
// import expressSession from 'express-session';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { bearerStrategyFinder } from './auth/tokenManagement';
import { emailRegistration, emailSignIn, accountDelete } from './auth/userManagement';

// import routes from './routes/index';
// import users from './routes/users';
import User from '../model/user';

const Router = express.Router();

// uncomment after placing your favicon in /public
// Router.use(favicon(__dirname + '/public/favicon.ico'));

Router.use(logger('dev'))
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({ extended: false }))
      .use(cookieParser())
      // .use(expressSession({
      //   secret: 'keyboard cat',
      //   resave: false,
      //   saveUninitialized: false,
      // }))
      .use(passport.initialize())
      // .use(passport.session())
      .use(express.static(path.join(__dirname, 'public')));

passport.use(new LocalStrategy(User.authenticate()));
passport.use(new BearerStrategy(bearerStrategyFinder));

mongoose.connect('mongodb://localhost/polestar');

// const localAuth = passport.authenticate('local', { session: false });

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

Router.route(ENDPOINTS.emailRegistrationPath)
      .post(emailRegistration)
      .delete(accountDelete);

Router.route(ENDPOINTS.emailSignInPath)
      .post((req, res, next) => {
        if (req.body.email) {
          req.body.username = req.body.email;
          delete req.body.email;
        }
        next();
      },
      passport.authenticate('local', { session: false }),
      emailSignIn);

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
