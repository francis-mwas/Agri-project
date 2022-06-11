import { object, string } from 'yup';

export const insuranceValidator = object().shape({
  companyName: string().required().trim(),
  pocPhoneNumber: string().required().trim(),
  businessEmail: string().required().email(),
  pocFullName: string().required().trim(),
  idNumber: string().required().trim()
});
