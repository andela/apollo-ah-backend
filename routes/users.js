import express from 'express';
import UsersController from '../controllers/users';
import Handler from '../middlewares/handleValidation';
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
 *   CDMS:
 *     properties:
 *       code:
 *         type: int
 *       data:
 *         type: object
 *     message:
 *       type: string
 *     status:
 *       type: boolean
 *
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
  Handler.handleRegistration,
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

/**
 * @swagger
 * /api/v1/users/forgot_password:
 *   post:
 *     tags:
 *       - password
 *     description: Sends a password reset link to the email address
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: User's email
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Password reset succesful
 *         schema:
 *           $ref: '#/definitions/User'
 *         format:
 *           $ref: '#/definitions/CMDS'
 */
router.post(
  '/forgot_password',
  Validator.validateForgotPassword(),
  Handler.handleForgotPassword,
  UsersController.sendPasswordRecoveryLink
);

/**
* /api/v1/users/confirm_account:
*  get:
*    tags:
*      - AccountConfirm
*    description: Confirm a user account
*    produces:
*       - application/json
*    parameters:
*      - name: token
*        description: The confirmation token
*        in: query
*        required: true
*        type: string
*    responses:
*      200:
*        description: Account confirmed
*        schema:
*          type: object
*/
router.get('/confirm_account', UsersController.confirmUser);


router.get('/sendmail', UsersController.sendUsersTestNotification);
export default router;
