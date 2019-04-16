import express from 'express';
import passport from '../config/passport';
import authController from '../controllers/authController';
import { env } from '../helpers/utils';

const router = express.Router();

const failureRedirect = () => ({
  failureRedirect: `${env('CLIENT_REDIRECT_URL')}?failure=true`
});

/**
 * @swagger
 * definitions:
 *   User:
 *     properties:
 *       id:
 *         type: int
 *       email:
 *         type: string
 *       token:
 *         type: string
 *   Response:
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
 * /api/v1/auth/facebook:
 *   get:
 *     tags:
 *       - social authentication
 *     description: Register or login user using facebook social authentication
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully registered
 *         schema:
 *           $ref: '#/definitions/User'
 */

// login user using social authentication
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get(
  '/facebook/redirect',
  passport.authenticate('facebook', failureRedirect()),
  authController.socialAuth
);

/**
 * @swagger
 * /api/v1/auth/google:
 *   get:
 *     tags:
 *       - social authentication
 *     description: Register or login user using google social authentication
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully registered
 *         schema:
 *           $ref: '#/definitions/User'
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ]
  })
);

router.get(
  '/google/redirect',
  passport.authenticate('google', failureRedirect()),
  authController.socialAuth
);

/**
 * @swagger
 * /api/v1/auth/twitter:
 *   get:
 *     tags:
 *       - social authentication
 *     description: Register or login user using twitter social authentication
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully registered
 *         schema:
 *           $ref: '#/definitions/User'
 */
router.get(
  '/twitter',
  passport.authenticate('twitter', { scope: ['include_email=true'] })
);

router.get(
  '/twitter/redirect',
  passport.authenticate('twitter', failureRedirect()),
  authController.socialAuth
);

export default router;
