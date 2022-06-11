import Level from '../models/sessionLevel';
import User from '../models/ussdUserModel';
import Product from '../models/Product';
import FarmInput from '../models/requestInputs';
import Insurance from '../models/insuranceCover';
import { checkUser, ussdLevels, farmingInfo } from '../utils/helper/ussdHelper';
import { validateEmail, validateID } from '../utils/helper/helper';
import sendSms from '../utils/helper/sendSms';

export default class UssdController {
  static async registerFarmer(req, res) {
    let message = '';
    const { phoneNumber, text } = req.body;

    const textValue = text.split('*');
    const lastUserInput = textValue[textValue.length - 1];

    let userLevel = ussdLevels.home;

    const currentLevel = await Level.findOne({ phoneNumber });

    if (currentLevel) {
      userLevel = currentLevel.level;
    }

    const termsAndConditions = 'https://goOrganic.com/terms';

    if (await checkUser(phoneNumber)) {
      if (!currentLevel) {
        const newLevel = new Level({
          phoneNumber,
          level: ussdLevels.home
        });

        try {
          await newLevel.save();

          userLevel = newLevel.level;
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err);
        }
      }

      const user = await checkUser(phoneNumber);

      const { fullName } = user;

      if (userLevel === ussdLevels.home) {
        switch (lastUserInput) {
          case '':
            // provide menu options
            message = `CON Welcome Back to goOrganic ${fullName}. Please select an option.\n`;
            message += '1. Request Farm Inputs.\n';
            message += '2. Request Farming Information.\n';
            message += '3. Request Insurance Cover.\n';
            message += '4. Upload A Product.\n';

            res.contentType('text/plain');
            res.status(200).send(message);
            break;
          case '1':
            // upgrade user level
            // eslint-disable-next-line max-len
            await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.farmInput1 } });
            message = 'CON Please enter the name of the farm input that you require.';
            res.contentType('text/plain');
            res.status(200).send(message);

            break;
          case '2':
            // eslint-disable-next-line max-len
            await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.farmingInfo1 } });
            message = 'CON Please enter category of farming(i.e maize, wheat, tomato,patatoes, etc).';
            res.contentType('text/plain');
            res.status(200).send(message);

            break;
          case '3':
            // eslint-disable-next-line max-len
            await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.insuranceCover1 } });
            message = 'CON Please enter category of your farming ie(patatoes farming,maize farming etc).';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
          case '4':
            // upgrade user level
            await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.upload1 } });
            message = 'CON Please enter product title.';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;

          default:
            message = 'CON Invalid choice, please select a valid choice.\n';
            message += '1. Request Farm Inputs.\n';
            message += '2. Request Farming Information.\n';
            message += '3. Request Insurance Cover.\n';
            message += '4. Upload Product.\n';

            res.contentType('text/plain');
            res.status(200).send(message);
            break;
        }
      }

      // handle farm input request option 1  case 1 here
      if (userLevel === ussdLevels.farmInput1) {
        switch (lastUserInput) {
          case '':
            message = 'CON Please enter farm input name or press 0 to go back.\n';
            message += '0. Go back. \n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
          case '0':
            // downgrade the level to home and present the menu
            await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.home } });
            // provide menu options
            message = 'CON Please select an option.\n';
            message += '1. Request Farm Inputs.\n';
            message += '2. Request Farming Information.\n';
            message += '3. Request Insurance Cover.\n';
            message += '4. Upload A Product.\n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;

          default:
            // eslint-disable-next-line no-case-declarations
            const newFarmInput = new FarmInput({
              // eslint-disable-next-line no-underscore-dangle
              user: user._id,
              phoneNumber,
              farmInputName: lastUserInput
            });

            await newFarmInput.save();
            // eslint-disable-next-line max-len
            await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.farmInput2 } });
            message = 'CON Please enter the quantity.\n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
        }
      }

      // handle farm input request option 1  case 2 here
      if (userLevel === ussdLevels.farmInput2) {
        switch (lastUserInput) {
          case '':
            message = 'CON Please enter the quantity or press 0 to go back.\n';
            message += '0. Go back. \n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
          case '0':
            // downgrade the level to home and present the menu
            await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.home } });
            // provide menu options
            message = 'CON Please select an option.\n';
            message += '1. Request Farm Inputs.\n';
            message += '2. Request Farming Information.\n';
            message += '3. Request Insurance Cover.\n';
            message += '4. Upload A Product.\n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;

          default:
            // update the Product doc with location
            await FarmInput.findOneAndUpdate(
              {
                phoneNumber
              },
              { $set: { quantity: lastUserInput } }
            );
            // eslint-disable-next-line max-len
            await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.farmInput3 } });
            message = 'CON Please enter the purpose of the farm input.\n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
        }
      }

      // handle farm input request option 1  case 3 here
      if (userLevel === ussdLevels.farmInput3) {
        switch (lastUserInput) {
          case '':
            message = 'CON Please enter the purpose of the farm input or press 0 to go back.\n';
            message += '0. Go back. \n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
          case '0':
            // downgrade the level to home and present the menu
            await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.home } });
            // provide menu options
            message = 'CON Please select an option.\n';
            message += '1. Request Farm Inputs.\n';
            message += '2. Request Farming Information.\n';
            message += '3. Request Insurance Cover.\n';
            message += '4. Upload A Product.\n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;

          default:
            // update the Product doc with location
            await FarmInput.findOneAndUpdate(
              {
                phoneNumber
              },
              { $set: { description: lastUserInput } }
            );
            // eslint-disable-next-line max-len
            await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.farmInput4 } });
            message = 'CON Please enter a brief description.\n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
        }
      }

      // handle farm input request option 1  case 4 here
      if (userLevel === ussdLevels.farmInput4) {
        switch (lastUserInput) {
          case '':
            message = 'CON Please enter a brief description or press 0 to go back.\n';
            message += '0. Go back. \n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
          case '0':
            // downgrade the level to home and present the menu
            await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.home } });
            // provide menu options
            message = 'CON Please select an option.\n';
            message += '1. Request Farm Inputs.\n';
            message += '2. Request Farming Information.\n';
            message += '3. Request Insurance Cover.\n';
            message += '4. Upload A Product.\n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;

          default:
            // update the Product doc with location
            await FarmInput.findOneAndUpdate(
              {
                phoneNumber
              },
              { $set: { purpose: lastUserInput } }
            );
            // eslint-disable-next-line max-len
            await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.home } });
            message = 'END Your input request has been received successfully, and is being acted on.\n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
        }
      }
      // handle insurance cover request here case 3 option here
      if (userLevel === ussdLevels.insuranceCover1) {
        switch (lastUserInput) {
          case '':
            message = 'CON Please enter category of your farming or press 0 to go back.\n';
            message += '0. Go back. \n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
          case '0':
            // downgrade the level to home and present the menu
            await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.home } });
            // provide menu options
            message = 'CON Please select an option.\n';
            message += '1. Request Farm Inputs.\n';
            message += '2. Request Farming Information.\n';
            message += '3. Request Insurance Cover.\n';
            message += '4. Upload A Product.\n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
          default:
            // eslint-disable-next-line no-case-declarations
            const newInsuranceCover = new Insurance({
              // eslint-disable-next-line no-underscore-dangle
              user: user._id,
              phoneNumber,
              farmingCategory: lastUserInput
            });

            await newInsuranceCover.save();
            await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.home } });
            // eslint-disable-next-line operator-linebreak
            message =
              'END Your request for insurance cover has been received successfully. Thankyou for using goOrganic.\n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
        }
      }

      // handle farming information request option 1  case 1 here
      if (userLevel === ussdLevels.farmingInfo1) {
        switch (lastUserInput) {
          case '':
            // eslint-disable-next-line operator-linebreak
            message =
              'CON Please enter category of farming(i.e maize, wheat, tomato,patatoes, etc)  or press 0 to go back.';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;

          case '0':
            // downgrade the level to home and present the menu
            await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.home } });
            // provide menu options
            message = 'CON Please select an option.\n';
            message += '1. Request Farm Inputs.\n';
            message += '2. Request Farming Information.\n';
            message += '3. Request Insurance Cover.\n';
            message += '4. Upload A Product.\n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
          default:
            // send user a message
            // update the Product doc with location
            await farmingInfo.map(async (cur) => {
              if (cur.category === lastUserInput) {
                const { description, company, bestSeeds } = cur;
                const msg = `Thank you for using goOrganic, here is the details about farming ${lastUserInput}.Below is a brief information that can help you in organic farming from ${company}, the best seed that you can use is: ${bestSeeds}, brief description on this farming ${description} `;
                await sendSms(phoneNumber, msg);
              }
            });
            // eslint-disable-next-line max-len
            await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.home } });
            // eslint-disable-next-line operator-linebreak
            message =
              'END Your request has been received, and you will receive an sms shortly regarding infomation that you requested.\n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
        }
      }
      // handle option 4 for uploading case 1 here
      if (userLevel === ussdLevels.upload1) {
        switch (lastUserInput) {
          case '':
            message = 'CON Please enter product title or press 0 to go back.\n';
            message += '0. Go back. \n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
          case '0':
            // downgrade the level to home and present the menu
            await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.home } });
            // provide menu options
            message = 'CON Please select an option.\n';
            message += '1. Request Farm Inputs.\n';
            message += '2. Request Farming Information.\n';
            message += '3. Request Insurance Cover.\n';
            message += '4. Upload A Product.\n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;

          default:
            // eslint-disable-next-line no-case-declarations
            const newProduct = new Product({
              // eslint-disable-next-line no-underscore-dangle
              user: user._id,
              phoneNumber,
              productTitle: lastUserInput
            });

            await newProduct.save();
            await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.upload2 } });
            message = 'CON Please enter your location.\n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
        }
      }
      // handle option 4 for uploading case 2 here
      if (userLevel === ussdLevels.upload2) {
        switch (lastUserInput) {
          case '':
            message = 'CON Please enter your location or press 0 to go back.\n';
            message += '0. Go back. \n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
          case '0':
            // downgrade the level to home and present the menu
            await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.home } });
            // provide menu options
            message = 'CON Please select an option.\n';
            message += '1. Request Farm Inputs.\n';
            message += '2. Request Farming Information.\n';
            message += '3. Request Insurance Cover.\n';
            message += '4. Upload A Product.\n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;

          default:
            // update the Product doc with location
            await Product.findOneAndUpdate(
              {
                phoneNumber
              },
              { $set: { location: lastUserInput } }
            );
            await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.upload3 } });
            message = 'CON Please enter product quantity.\n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
        }
      }
      // handle option 4 for uploading case 3 here

      if (userLevel === ussdLevels.upload3) {
        switch (lastUserInput) {
          case '':
            message = 'CON Please enter product quantity or press 0 to go back.\n';
            message += '0. Go back. \n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
          case '0':
            // downgrade the level to home and present the menu
            await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.home } });
            // provide menu options
            message = 'CON Please select an option.\n';
            message += '1. Request Farm Inputs.\n';
            message += '2. Request Farming Information.\n';
            message += '3. Request Insurance Cover.\n';
            message += '4. Upload A Product.\n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;

          default:
            // update the Product doc with location
            await Product.findOneAndUpdate(
              {
                phoneNumber
              },
              { $set: { productQuantity: lastUserInput } }
            );
            await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.upload4 } });
            message = 'CON Please enter price per quantity.\n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
        }
      }

      // handle option 4 for uploading case 4 here

      if (userLevel === ussdLevels.upload4) {
        switch (lastUserInput) {
          case '':
            message = 'CON Please enter price per quantity or press 0 to go back.\n';
            message += '0. Go back. \n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
          case '0':
            // downgrade the level to home and present the menu
            await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.home } });
            // provide menu options
            message = 'CON Please select an option.\n';
            message += '1. Request Farm Inputs.\n';
            message += '2. Request Farming Information.\n';
            message += '3. Request Insurance Cover.\n';
            message += '4. Upload A Product.\n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;

          default:
            // update the Product doc with location
            await Product.findOneAndUpdate(
              {
                phoneNumber
              },
              { $set: { pricePerUnit: lastUserInput } }
            );
            await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.upload5 } });
            message = 'CON Please enter product description.\n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
        }
      }
      // handle option 4 for uploading case 5 here
      if (userLevel === ussdLevels.upload5) {
        switch (lastUserInput) {
          case '':
            message = 'CON Please enter product description or press 0 to go back.\n';
            message += '0. Go back. \n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
          case '0':
            // downgrade the level to home and present the menu
            await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.home } });
            // provide menu options
            message = 'CON Please select an option.\n';
            message += '1. Request Farm Inputs.\n';
            message += '2. Request Farming Information.\n';
            message += '3. Request Insurance Cover.\n';
            message += '4. Upload A Product.\n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;

          default:
            // update the Product doc with location
            await Product.findOneAndUpdate(
              {
                phoneNumber
              },
              { $set: { productDescription: lastUserInput } }
            );
            await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.home } });
            message = 'END Thank you, your product has been uploaded successfully to our marketplace.\n';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
        }
      }
    } else {
      if (!currentLevel) {
        const level = new Level({
          phoneNumber,
          level: ussdLevels.userRegister0
        });
        try {
          await level.save();
          userLevel = level.level;
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err);
        }
      }
      // handle registration option case 1 here
      if (userLevel === ussdLevels.userRegister0) {
        switch (lastUserInput) {
          case '':
            // welcome users
            message = `CON Welcome to goOrganic. please read our terms and conditions before registering: ${termsAndConditions}\n`;
            message += '1. Proceed with registration\n';
            message += '0. Cancel';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
          case '0':
            await Level.findOneAndDelete({ phoneNumber });

            message = 'END Thank you for visiting our platform. Feel free to come again.';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
          case '1':
            // eslint-disable-next-line max-len
            await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.userRegister1 } });
            message = 'CON Please enter your full name to continue.';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
          default:
            message = `CON Welcome to goOrganic. please read our terms and conditions before registering: ${termsAndConditions}\n`;
            message += '1. Proceed with registration\n';
            message += '0. Cancel';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
        }
      }

      // handle registration option case 2 here

      if (userLevel === ussdLevels.userRegister1) {
        switch (lastUserInput) {
          case '':
            message = 'CON Please enter your full name to continue or press 0 to cancel.\n';
            message += '0. Cancel.';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
          case '0':
            await Level.findOneAndDelete({ phoneNumber });

            message = 'END Thank you for visiting our platform. Feel free to come again.';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
          default:
            // eslint-disable-next-line no-case-declarations
            const newUser = new User({
              phoneNumber,
              fullName: lastUserInput
            });
            try {
              await newUser.save();
            } catch (err) {
              // eslint-disable-next-line no-console
              console.log(err);
            }

            // eslint-disable-next-line max-len
            await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.userRegister2 } });

            message = 'CON Please enter your email address.';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
        }
      }

      // handle registration option case 3 here
      if (userLevel === ussdLevels.userRegister2) {
        switch (lastUserInput) {
          case '':
            message = 'CON Please provide your email address or press 0 to cancel.\n';
            message += '0. Cancel.';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
          case '0':
            await Level.findOneAndDelete({ phoneNumber });
            await User.findOneAndDelete({ phoneNumber });
            message = 'END Thank you for visiting our platform. Feel free to come again.';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
          default:
            if (validateEmail(lastUserInput)) {
              const userEmail = await User.findOne({
                email: lastUserInput
              });
              if (userEmail) {
                message = 'CON Email address already registered. Please provide another email or press 0 to cancel.\n';
                message += '0. Cancel.';
                res.contentType('text/plain');
                res.status(200).send(message);
                break;
              }

              await User.findOneAndUpdate({ phoneNumber }, { $set: { email: lastUserInput } });

              // eslint-disable-next-line max-len
              await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.userRegister3 } });

              message = 'CON Please enter your national ID number or press 0 to cancel.';
              res.contentType('text/plain');
              res.status(200).send(message);
              break;
            } else {
              message = 'CON Please provide valid email address or press 0 to cancel.\n';
              message += '0. Cancel.';
              res.contentType('text/plain');
              res.status(200).send(message);
              break;
            }
        }
      }

      // handle registration option case 4 here
      if (userLevel === ussdLevels.userRegister3) {
        switch (lastUserInput) {
          case '':
            message = 'CON Please enter your national ID number or press 0 to cancel.\n';
            message += '0. Cancel.';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
          case '0':
            await Level.findOneAndDelete({ phoneNumber });
            await User.findOneAndDelete({ phoneNumber });
            message = 'END Thank you for visiting our platform. Feel free to come again.';
            res.contentType('text/plain');
            res.status(200).send(message);
            break;
          default:
            if (validateID(lastUserInput)) {
              const userID = await User.findOne({
                idNumber: lastUserInput
              });
              if (userID) {
                // eslint-disable-next-line operator-linebreak
                message =
                  'CON National ID number already registered, provide a different ID number or press 0 to cancel.\n';
                message += '0. Cancel.';
                res.contentType('text/plain');
                res.status(200).send(message);
                break;
              }

              await User.findOneAndUpdate({ phoneNumber }, { $set: { idNumber: lastUserInput } });

              await Level.findOneAndUpdate({ phoneNumber }, { $set: { level: ussdLevels.home } });

              // provide menu options
              message = 'CON Welcome to goOrganic. Please select an option.\n';
              message += '1. Request Farm Inputs.\n';
              message += '2. Request Farming Information.\n';
              message += '3. Request Insurance Cover.\n';
              message += '4. Upload A Product.\n';

              res.contentType('text/plain');
              res.status(200).send(message);
              break;
            } else {
              message = 'CON Please provide valid national ID number or press 0 to cancel.\n';
              message += '0. Cancel.';
              res.contentType('text/plain');
              res.status(200).send(message);
              break;
            }
        }
      }
    }
  }
}
