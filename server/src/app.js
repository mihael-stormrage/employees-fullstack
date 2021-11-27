import Express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import path from 'path';

import apiRouter from './routes';

const app = new Express();

app.use(logger('dev'));
app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'production') {
  app.use(Express.static(path.join('..', 'client', 'build')));
}
app.use('/api', apiRouter);

export default app;
