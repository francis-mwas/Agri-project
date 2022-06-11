/* eslint-disable consistent-return */
import request from 'supertest';
import { startTestDb, stopTestDb, baseUrl } from '../utils';
// import startServer from '../../src/config/startServer';
import app from '../../src/app';

// let app;
beforeAll(async () => {
  await startTestDb();
  // app = startServer();
});

afterAll(async () => {
  await stopTestDb();
  // await app.close();
});

const input = {
  firstname: 'Obi',
  lastname: 'Mbalanya',
  email: 'random2@gmail.com',
  idNumber: '12345678',
  phoneNumber: '0700000000',
  password: 'dexerts',
  role: 'farmer'
};

describe('test farmer registration', () => {
  test('will return empty array when no users are available', async () => {
    const res = await request(app).get(`${baseUrl}/farmer/all`).set('Accept', 'application/json');
    expect(res.body.data.length).toBe(0);
  });

  test('will not register user with invalid data', async () => {
    const res = await request(app).post(`${baseUrl}/farmer/register`).set('Accept', 'application/json');
    expect(res.status).toBe(422);
    expect(res.body.error.length).toBeGreaterThan(0);
  });

  test('will register a user successfully', (done) => {
    request(app)
      .post(`${baseUrl}/farmer/register`)
      .send(input)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).toBe(true);
        done();
      });
  });

  test('will fail to register a user with same email twice', (done) => {
    request(app)
      .post(`${baseUrl}/farmer/register`)
      .send(input)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).toBe(false);
        done();
      });
  });
});
