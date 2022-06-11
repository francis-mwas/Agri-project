import User from '../../models/ussdUserModel';

export const checkUser = async (phoneNumber) => {
  const user = await User.findOne({ phoneNumber });
  // eslint-disable-next-line max-len
  if (user && user.fullName !== undefined && user.email !== undefined && user.idNumber !== undefined) {
    return user;
  }
  return undefined;
};

export const farmingInfo = [
  {
    description: 'lorem ipsum',
    title: 'Wheat farming',
    category: 'wheat',
    company: 'Duma feeds',
    bestSeeds: 'duma-143'
  },
  {
    description: 'This is the best maize seeds ever',
    title: 'Maize farming',
    category: 'maize',
    company: 'Hybrid  Inc',
    bestSeeds: 'hybrid 614'
  },
  {
    description: 'The best onions in town',
    title: 'Onions farming',
    category: 'Onions',
    company: 'Onions Co',
    bestSeeds: 'red-onions'
  }
];

export const ussdLevels = {
  home: 'home',
  farmInput1: 'farmInput1',
  farmInput2: 'farmInput2',
  farmInput3: 'farmInput3',
  farmInput4: 'farmInput4',
  farmingInfo1: 'farmingInfo1',
  insuranceCover1: 'insuranceCover1',
  upload1: 'upload1',
  upload2: 'upload2',
  upload3: 'upload3',
  upload4: 'upload4',
  upload5: 'upload5',
  userRegister0: 'userRegister0',
  userRegister1: 'userRegister1',
  userRegister2: 'userRegister2',
  userRegister3: 'userRegister3'
};
