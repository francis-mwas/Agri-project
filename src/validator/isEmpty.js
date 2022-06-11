export default (value) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  value === null
  || (typeof value === 'object' && Object.keys(value).length === 0)
  || (typeof value === 'string' && value.trim().length === 0);
