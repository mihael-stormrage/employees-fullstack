import Express from 'express';
import cookieParser from 'cookie-parser';
const logger = require('morgan');

import apiRouter from './routes';

const app = new Express();

app.use(logger('dev'));
app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());
app.use(cookieParser());

app.use('/api', apiRouter);

export default app;
