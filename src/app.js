/* eslint-disable no-unused-vars */
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes';

const app = express();

dotenv.config();

// MIDDLEWARES

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.json('kjlaf');
});
app.use('/api/v1/', router);

/* extract input from form data */
app.use(express.urlencoded());

// error handler
app.use((err, req, res, _next) => res.status(err.status || 500).send({ error: err.message }));

app.use((req, res) => res.status(404).json({ Message: 'URL DOES NOT EXIST, Please counter check' }));

export default app;
