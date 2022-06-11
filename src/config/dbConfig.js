/* eslint-disable no-console */
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// connect local db for local development
const DB = process.env.DATABASE_LOCAL_URL;

const dbConnect = () => {
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log('DB connection successful!');
    })
    .catch((err) => {
      console.log('an erro occurred:  ', err);
    });
};

export default dbConnect;
