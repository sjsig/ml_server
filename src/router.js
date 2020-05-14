import { Router } from 'express';
import * as UserController from './controllers/user_controller';
import { requireAuth, requireSignin } from './services/passport';
import bcrypt from 'bcryptjs'

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our landlord api!' });
});

router.route('/users/:userId')
  .get(UserController.getUser)
  .delete(UserController.deleteUser);

router.post('/signin', requireSignin, UserController.signin);
router.post('/signup', UserController.signup);


export default router;
