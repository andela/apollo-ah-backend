import express from 'express';
import profileController from '../controllers/profileController';
import middlewares from '../middlewares';


const profileRouter = express.Router();

/**
 * @swagger
 * definitions:
 *   Profile:
 *     properties:
 *       firstname:
 *         type: string
 *       lastname:
 *         type: string
 *       username:
 *         type: string
 *       gender:
 *         type: string
 *       bio:
 *         type: string
 *       phone:
 *         type: string
 *       address:
 *         type: string
 *       image:
 *         type: string
 */


profileRouter.post(
  '/profile',
  middlewares.authenticate,
  middlewares.validateCreateProfile,
  profileController.create
);

export default profileRouter;
