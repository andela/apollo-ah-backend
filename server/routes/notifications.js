import express from 'express';
import notificationsController from '../controllers/notificationsController';
import middlewares from '../middlewares';

const notificationsRouter = express.Router();


/**
* /api/v1/users/confirm_account:
*  get:
*    tags:
*      - Notifications
*    description: Get all of a users notifications
*    produces:
*       - application/json
*    parameters:
*      - name: Authorization
*        description: Auth token
*        in: header
*        required: true
*        type: string
*    responses:
*      200:
*        description: OK
*        schema:
*          type: object
*/
notificationsRouter.get(
  '/',
  middlewares.authenticate,
  notificationsController.getAllNotifications
);

export default notificationsRouter;
