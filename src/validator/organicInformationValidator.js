import { object, string } from 'yup';

export const organicInformationValidator = object().shape({
  title: string().required().trim(),
  category: string().required().trim(),
  company: string().required().trim(),
  seeds: string().required().trim(),
  description: string().required().trim()
});
