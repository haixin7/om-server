// app.js
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import categoriesRouter from './routes/categories';
import itemsRouter from './routes/items';
import variantsRouter from './routes/variants';
import filesRouter from './routes/files';
import twilioRouter from './routes/twilio';
import merchantsRouter from './routes/merchant';
import stripeRouter from './routes/stripe';
import tablesRouter from './routes/tables';
import paymentsRouter from './routes/payments';

import usersRouter from './routes/users';
import reviewsRouter from './routes/reviews';
import ordersRouter from './routes/orders';
import authRouter from './routes/auth';
import employeeRouter from './routes/employees';
import connectToDatabase from './db';

const app = express();
app.use(cors());
console.log('test');
connectToDatabase();
app.use(logger('dev'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use('/auth', authRouter);

app.use('/categories', categoriesRouter);
app.use('/items', itemsRouter);
app.use('/variants', variantsRouter);
app.use('/files', filesRouter);
app.use('/twilio', twilioRouter);
app.use('/merchants', merchantsRouter);

app.use('/stripe', stripeRouter);

app.use('/tables', tablesRouter);

app.use('/employees', employeeRouter);
app.use('/payments', paymentsRouter);
app.use('/users', usersRouter);
app.use('/reviews', reviewsRouter);
app.use('/orders', ordersRouter);
app.use('/auth', authRouter);

export default app;
