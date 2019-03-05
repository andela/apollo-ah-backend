import express from 'express';
import UsersController from '../controllers/users-controller';

const router = express.Router();

/** user registration endpoint */
router.post('/', UsersController.register);

/** user login endpoint */
router.post('/login', UsersController.login);

export default router;
