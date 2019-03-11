import express from 'express';
import users from './users';
import authRoute from './auth';
import profileRouter from './profile';
import articles from './articles';

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
router.use('/auth', authRoute);
router.use(profileRouter);
router.use('/articles', articles);

export default router;
