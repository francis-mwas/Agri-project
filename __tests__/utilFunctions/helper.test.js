import { validateEmail, validateID } from '../../src/utils/helper/helper';

const validEmail = 'test@gmail.com';
const invalidEmail = 'testghcom';
const validId = '12345678';
const invalidId = '12345';

describe('Test helper function', () => {
  test('should return true incase of valid email', () => {
    expect(validateEmail(validEmail)).toBe(true);
  });

  test('should return false incase of invalid email ', () => {
    expect(validateEmail(invalidEmail)).toBe(false);
  });

  test('should test Id number for valid Id', () => {
    expect(validateID(validId)).toBe(true);
  });

  test('should test for invalid Id ', () => {
    expect(validateID(invalidId)).toBe(false);
  });
});
