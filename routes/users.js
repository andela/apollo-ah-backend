import express from 'express';
import UsersController from '../controllers/users';
import { handleRegistration } from '../middlewares/handleValidation';
import Validator from '../middlewares/validator';

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   User:
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 */

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     tags:
 *       - register
 *     description: Register a new user account
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: User's email
 *         in: body
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully registered
 *         schema:
 *           $ref: '#/definitions/User'
 */
router.post('/',
  Validator.validateRegistration(),
  handleRegistration,
  UsersController.register);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     tags:
 *       - login
 *     description: Login into user account
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: User's email
 *         in: body
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         schema:
 *           $ref: '#/definitions/User'
 */
router.post('/login', UsersController.login);


router.get('/confirm_account', UsersController.confirmUser);

export default router;
