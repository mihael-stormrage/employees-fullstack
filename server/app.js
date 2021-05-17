import Express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes';
import usersRouter from './routes/users';

const app = new Express();

app.use(logger('dev'));
app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);

export default app;
