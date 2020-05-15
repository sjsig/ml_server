import { Router } from 'express';
import * as UserController from './controllers/user_controller';
import * as PropertyController from './controllers/property_controller';
import * as UnitController from './controllers/unit_controller';

import { requireAuth, requireSignin } from './services/passport';
import bcrypt from 'bcryptjs'

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our landlord api!' });
});

// USER CONTROLLER
router.route('/users/:userId')
  .get(UserController.getUser)
  .delete(UserController.deleteUser);

router.post('/signin', requireSignin, UserController.signin);
router.post('/signup', UserController.signup);

// PROPERTY CONTROLLER
router.route('/property/:propertyId')
  .get(PropertyController.getProperty)
  .delete(PropertyController.deleteProperty)
  .put(PropertyController.updateProperty)

router.route('/property')
  .post(PropertyController.createProperty)

// UNIT CONTROLLER
router.route('/property/:propertyId/unit/:unitId')
  .get(UnitController.deleteUnit)
  .delete(UnitController.deleteUnit)

router.route('/property/:propertyId/unit')
  .post(UnitController.createUnit)

export default router;
