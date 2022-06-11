import { Router } from 'express';
import InsuranceMiddleware from '../middleware/insuranceCompany';
import AdminMiddleware from '../middleware/admin';
import { AdminController } from '../controllers/adminController';
import isAuth from '../middleware/auth';
import accessControl from '../middleware/access';

const router = Router();

// handle insurance companies crud
router.post(
  '/register-insurance',
  isAuth,
  accessControl.restrictAccessTo('admin'),
  InsuranceMiddleware.uniqueInsuranceName,
  InsuranceMiddleware.uniquePhoneNumber,
  AdminController.registerInsurance
);

router.get('/companies', isAuth, accessControl.restrictAccessTo('admin'), AdminController.getAllInsuranceCompanies);
router.get('/companies/:id', isAuth, accessControl.restrictAccessTo('admin'), AdminController.getSingleCompany);
router.delete('/companies/:id', isAuth, accessControl.restrictAccessTo('admin'), AdminController.deleteCompany);

// handle all products operation here
router.get('/products', isAuth, accessControl.restrictAccessTo('admin'), AdminController.getAllUploadedProducts);
router.get('/products/:id', isAuth, accessControl.restrictAccessTo('admin'), AdminController.getSingleProduct);

router.get('/products/:id', isAuth, accessControl.restrictAccessTo('admin'), AdminController.deleteProduct);

// handle all agro chemicals operation here
router.get('/agro-companies', isAuth, accessControl.restrictAccessTo('admin'), AdminController.getAllAgroChemicals);
router.get(
  '/agro-companies/:id',
  isAuth,
  accessControl.restrictAccessTo('admin'),
  AdminController.getSingleAgroChemical
);
router.delete(
  '/agro-companies/:id',
  isAuth,
  accessControl.restrictAccessTo('admin'),
  AdminController.deleteAgroChemical
);

// update profile
router.patch(
  '/update-profile',
  isAuth,
  accessControl.restrictAccessTo('admin'),
  AdminMiddleware.checkEmptyValues,
  AdminController.updateUserDetails
);

export default router;
