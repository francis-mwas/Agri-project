import { object, string, number } from 'yup';

export const farmInputValidator = object().shape({
  name: string().required().trim(),
  price: number().required(),
  quantity: number().required(),
  imageUrl: string().trim(),
  description: string().required()
});
