import express from 'express';
import profileController from '../controllers/profileController';
import followersController from '../controllers/followersController';
import middlewares from '../middlewares';
import Validator from '../middlewares/validator';
import Handler from '../middlewares/handleValidation';

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
 *           $ref: '#/definitions/Profile'
 */
profileRouter.post(
  '/profiles',
  middlewares.authenticate,
  Validator.validateUpdateProfile(),
  Handler.handleProfileUpdate,
  profileController.updateProfile,
)

/**
 * @swagger
 * /api/v1/profile:
 *   get:
 *     tags:
 *       - profile
 *     description: Get all profiles
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: You have successfully fetched the profile for all users
 *         schema:
 *           $ref: '#/definitions/Profile'
 */

  .get(
    '/profiles',
    middlewares.authenticate,
    profileController.getAllProfiles,
  )

/**
 * @swagger
 * /api/v1/profile/:username:
 *   get:
 *     tags:
 *       - profile
 *     description: Get a profile
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Successfully returned a user
 *         schema:
 *           $ref: '#/definitions/Profile'
 */

  .get(
    '/profiles/:username',
    middlewares.authenticate,
    profileController.getProfile,
  );

/**
 * @swagger
 * /api/v1/profiles/{username}/follow:
 *   post:
 *     tags:
 *       - follow
 *       - following
 *       - follower
 *     description: Authenticated user can follow other users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully followed user
 */
profileRouter.post(
  '/profiles/:username/follow',
  middlewares.authenticate,
  followersController.follow
);

/**
 * @swagger
 * /api/v1/profiles/{username}/unfollow:
 *   post:
 *     tags:
 *       - unfollow
 *       - following
 *       - follower
 *     description: Authenticated user can unfollow other users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully unfollowed user
 */
profileRouter.post(
  '/profiles/:username/unfollow',
  middlewares.authenticate,
  followersController.unfollow
);

/**
 * @swagger
 * /api/v1/profiles/followers:
 *   get:
 *     tags:
 *       - followers
 *     description: Fetch all followers by authenticated user
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful
 */
profileRouter.get(
  '/profiles/followers',
  middlewares.authenticate,
  followersController.followers
);

/**
 * @swagger
 * /api/v1/profiles/followers:
 *   get:
 *     tags:
 *       - followers
 *     description: Fetch all the following users by authenticated user
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful
 */
profileRouter.get(
  '/profiles/following',
  middlewares.authenticate,
  followersController.followers
);

export default profileRouter;
