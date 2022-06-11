import { startTestDb, stopTestDb } from '../utils';
import { ussdLevels } from '../../src/utils/helper/ussdHelper';
import UssdController from '../../src/controllers/ussdFarmerController';
import User from '../../src/models/ussdUserModel';
import Level from '../../src/models/sessionLevel';

const userData = {
  firstname: 'Obi',
  lastname: 'Mbalanya',
  email: 'random2@gmail.com',
  idNumber: '12345678',
  phoneNumber: '+254717445860',
  password: 'dexerts',
  role: 'farmer'
};

const levelInput = {
  phoneNumber: '+254717445860',
  level: ussdLevels.home
};

// let app;
beforeAll(async () => {
  await startTestDb();
  // app = startServer();
});

beforeEach(async () => {
  // create new user and levels
  const user = new User(userData);
  await user.save();

  const userLevel = new Level(levelInput);
  await userLevel.save();
});

afterEach(async () => {
  await User.deleteMany();
  await Level.deleteMany();
});

afterAll(async () => {
  await stopTestDb();
  // await app.close();
});

const termsAndConditions = 'https://goOrganic.com/terms';
let message = `CON Welcome to goOrganic. please read our terms and conditions before registering: ${termsAndConditions}\n`;
message += '1. Proceed with registration\n';
message += '0. Cancel';

let userLevel = 'home';

const mockRequest = (lastUserInputs, phoneNumber) => ({
  body: {
    lastUserInputs,
    phoneNumber
  }
});

const mockResponse = () => {
  userLevel = ussdLevels.userRegister0;

  const res = {};
  res.text = jest.fn().mockReturnValue(res);
  res.contentType = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('Test ussd flow', () => {
  test('should check if all user level properties have been defined', () => {
    expect(ussdLevels.home).toBe('home');
    expect(ussdLevels.userRegister0).toBe('userRegister0');
    expect(ussdLevels.userRegister1).toBe('userRegister1');
    expect(ussdLevels.userRegister2).toBe('userRegister2');
    expect(ussdLevels.userRegister3).toBe('userRegister3');
  });
  test('check if user was created', async (done) => {
    const user = await User.countDocuments();
    expect(user).toBe(1);
    done();
  });

  test('check if level was created', async (done) => {
    const levels = await Level.countDocuments();
    expect(levels).toBe(1);
    done();
  });

  test('check if default level is home', async (done) => {
    const level = await Level.find();
    expect(userLevel).toBe(level[0].level);
    done();
  });

  test('should return a welcome messgae', async (done) => {
    const req = mockRequest({
      phoneNumber: '+254717445860',
      lastUserInput: ''
    });
    const res = mockResponse();
    await UssdController.registerFarmer(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.contentType).toHaveBeenCalledWith('text/plain');
    expect(res.send).toHaveBeenCalledWith(message);
    done();
  });

  test('should return fullnames message', async () => {
    const message1 = 'CON Please enter your full name to continue.';
    userLevel = 'userRegister0';
    const req = mockRequest({
      phoneNumber: '+254717445860',
      lastUserInput: '1'
    });
    const res = mockResponse();
    if (req.lastUserInput === '1' && userLevel === 'userRegister0') {
      await UssdController.registerFarmer(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.contentType).toHaveBeenCalledWith('text/plain');
      expect(res.send).toHaveBeenCalledWith(message1);
    }
  });
});
