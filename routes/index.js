import express from 'express';
import users from './users';
import profile from './profile';
import authRoute from './auth';
import articles from './articles';
import settingRouter from './settings';
import bookmark from './bookmarks';
import notificationsRouter from './notifications';


const router = express.Router();

/**
 * @swagger
 * definitions:
 *   User:
 *     properties:
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       phone:
 *         type: integer
 *       password:
 *         type: string
 */
router.use('/users', users);
router.use(profile);
router.use('/articles', articles);
router.use('/auth', authRoute);
router.use('/articles', articles);
router.use('/setting', settingRouter);
router.use('/bookmarks', bookmark);
router.use('/notification', notificationsRouter);

export default router;
