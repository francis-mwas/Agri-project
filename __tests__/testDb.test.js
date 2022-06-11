import { User } from '../src/models/User';
import { startTestDb, stopTestDb } from './utils';

beforeAll(async () => {
  await startTestDb();
});

afterAll(async () => {
  await stopTestDb();
});

describe('...', () => {
  it('test memory db connection', async () => {
    const count = await User.countDocuments();
    expect(count).toEqual(0);
  });
});
