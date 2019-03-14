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

/**
 * @swagger
 * /api/v1/profile:
 *   post:
 *     tags:
 *       - profile
 *     description: Create a new article
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: firstname
 *         description: users firstname
 *         in: body
 *         required: true
 *         type: string
 *       - name: lastname
 *         description: users lastname
 *         in: body
 *         required: true
 *         type: string
 *       - name: username
 *         description: A selected username for the user
 *         in: body
 *         required: true
 *         type: string
 *       - name: bio
 *         description: A brief bio of the user
 *         in: body
 *         required: true
 *         type: string
 *       - name: image
 *         description: A photo image of the user
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: Profile created successfully
 *         schema:
 *           $ref: '#/definitions/Article'
 */
profileRouter.post(
  '/profile',
  middlewares.authenticate,
  middlewares.validateCreateProfile,
  profileController.create
);

export default profileRouter;
