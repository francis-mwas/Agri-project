import smsCredentials from '../../config/credentials';
// eslint-disable-next-line import/order
const africastalking = require('africastalking')(smsCredentials);

const sms = africastalking.SMS;

/**
 * Send an sms by passing all necessary required arguments..
 * @param {message} message - The message that you want to send
 * @param {phoneNumber} phoneNumber - Represents a client phone number to send sms to
 */

const sendSms = async (phoneNumber, message) => {
  const options = {
    to: phoneNumber,
    message,
    enque: true
  };

  await sms
    .send(options)
    // eslint-disable-next-line no-console
    .then((response) => console.log(response))
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(`Error occurred: ${err}`);
    });
};

export default sendSms;
