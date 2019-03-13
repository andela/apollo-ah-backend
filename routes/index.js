import express from 'express';
import users from './users';
import profileRouter from './profile';
import articles from './articles';
import settingRouter from './settings';

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
router.use(profileRouter);
router.use('/articles', articles);
router.use('/setting', settingRouter);
export default router;
