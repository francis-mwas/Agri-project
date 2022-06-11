import request from 'supertest';
import { startTestDb, stopTestDb } from './utils';
import app from '../src/app';

beforeAll(async () => {
  await startTestDb();
});

afterAll(async () => {
  await stopTestDb();
});
test('will return 404 for unknown routes', (done) => {
  request(app)
    .get('/user')
    .auth('username', 'password')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(404, done);
});
