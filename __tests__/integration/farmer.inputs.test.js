import request from 'supertest';
import { startTestDb, stopTestDb, baseUrl } from '../utils';
import app from '../../src/app';

const farmInput = {
  name: 'manure',
  price: 900,
  quantity: 408,
  description: 'This is teh description',
  imageUrl: 'https://image.comyyy'
};

beforeAll(async (done) => {
  await startTestDb();
  // app = startServer();
  request(app)
    .post(`${baseUrl}/farmer/sign-in`)
    .send({ email: 'denniskyn80@gmail.com', password: '123456' })
    .set('Accept', 'application/json')
    .expect(400)
    .end((err, res) => {
      if (err) return done(err);
      return done(res.body.token);
    });
});

afterAll(async () => {
  await stopTestDb();
  // await app.close();
});

describe('POST / farmInput', () => {
  test('will not post a farm input', async () => {
    const res = await request(app).post(`${baseUrl}/farmer/farm-input`).send(farmInput);
    expect(res.statusCode).toBe(401);
  });
  test('GET / will not get farm inputs', async () => {
    const res = await request(app).get(`${baseUrl}/farmer/farm-input`);
    expect(res.statusCode).toBe(401);
  });
});
