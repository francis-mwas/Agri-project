// validate email
export const validateEmail = (mail) => {
  if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  return false;
};
// validate phone number
export const validateID = (idNumber) => {
  if (/^[0-9]{6,8}$/.test(idNumber)) {
    return true;
  }
  return false;
};
