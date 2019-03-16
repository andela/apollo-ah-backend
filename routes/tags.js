import express from 'express';
import TagsController from '../controllers/tagsController';
import middlewares from '../middlewares';

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   Tag:
 *     properties:
 *       tagName:
 *         type: string
 */

/**
 * @swagger
 * /api/v1/tags:
 *   post:
 *     tags:
 *       - article tags
 *     description: Fetch a list of article tags
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully registered
 *         schema:
 *           $ref: '#/definitions/Tag'
 */
router.get('/', middlewares.authenticate, TagsController.index);

export default router;
