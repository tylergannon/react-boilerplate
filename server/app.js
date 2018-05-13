/* eslint consistent-return:0 */
import express from 'express';
import { resolve } from 'path';
import setup from './middlewares/frontendMiddleware';
import authRoutes from './middlewares/authenticationRoutes';

const app = express();

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);
app.use('/api/auth', authRoutes);

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

export default app;
