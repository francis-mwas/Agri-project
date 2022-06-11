import { Router } from 'express';
import OrganicFarmingInfo from '../controllers/bestPractices.controller';
import isAuth from '../middleware/auth';
import accessControl from '../middleware/access';

const router = Router();

router.post('/farming-information', isAuth, accessControl.restrictAccessTo('admin', 'agro-chemical-company'), OrganicFarmingInfo.farmingInformation);

router.get('/farming-information', isAuth, accessControl.restrictAccessTo('admin', 'agro-chemical-company'), OrganicFarmingInfo.getFarmingInformation);


router.get('/farming-information/:id', isAuth, accessControl.restrictAccessTo('admin', 'agro-chemical-company'), OrganicFarmingInfo.getSingleInformation);


router.delete('/farming-information/:id', isAuth, accessControl.restrictAccessTo('admin', 'agro-chemical-company'), OrganicFarmingInfo.deleteFarmingInformation);

export default router;
