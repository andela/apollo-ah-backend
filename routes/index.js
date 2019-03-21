import express from 'express';
import users from './users';
import profile from './profile';
import authRoute from './auth';
import articles from './articles';
import settingRouter from './settings';
import bookmark from './bookmarks';
import tags from './tags';
import notificationsRouter from './notifications';
import reportRoute from './reportArticle';
import comments from './comments';


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
router.use('/auth', authRoute);
router.use('/articles', reportRoute, articles);
router.use('/setting', settingRouter);
router.use('/bookmarks', bookmark);
router.use('/tags', tags);
router.use('/notification', notificationsRouter);
router.use('/articles', reportRoute);
router.use('/articles', comments);

export default router;
