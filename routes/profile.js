import express from 'express';
import profileController from '../controllers/profileController';
import followersController from '../controllers/followersController';
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
