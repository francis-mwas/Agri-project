/* eslint-disable no-undef */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// May require additional time for downloading MongoDB binaries
// jasmine.DEFAULT_TIMEOUT_INTERVAL = 400000;

let mongoServer;

export const startTestDb = async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    // eslint-disable-next-line no-console
    if (err) console.error(err);
  });
};

export const stopTestDb = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
};

export const baseUrl = '/api/v1';
