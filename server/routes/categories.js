import express from 'express';
import categoriesController from '../controllers/categoriesController';

const categoriesRouter = express.Router();

/**
* /api/v1/categories:
*  get:
*    tags:
*      - Categories
*    description: Gets all categories
*    produces:
*       - application/json
*    responses:
*      200:
*        description: Categories fetched successfully
*        schema:
*          type: object
*/
categoriesRouter.get('/', categoriesController.getAll);

export default categoriesRouter;
