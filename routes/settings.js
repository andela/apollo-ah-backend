import express from 'express';
import settingController from '../controllers/settingsController';
import middlewares from '../middlewares';
import Handler from '../middlewares/handleValidation';
import Validator from '../middlewares/validator';


const settingRouter = express.Router();

/**
* /api/v1/setting:
*  put:
*    tags:
*      - Settings
*    description: Uppdate a users setting
*    produces:
*       - application/json
*    parameters:
*      - name: canEmail
*        description: Enables or disables user email notification
*        in: body
*        required: false
*        type: boolean
*      - name: canNotify
*        description: Enables or disables user notification
*        in: body
*        required: false
*        type: boolean
*    responses:
*      200:
*        description: User setting updated
*        schema:
*          type: object
*/
settingRouter.put(
  '/',
  middlewares.authenticate,
  Validator.validateSettings(),
  Handler.handleValidation,
  settingController.update
);

/**
* /api/v1/setting:
*  get:
*    tags:
*      - Settings
*    description: Gets a users setting
*    produces:
*       - application/json
*    parameters:
*      - name: token
*        description: The confirmation token
*        in: query
*        required: true
*        type: string
*    responses:
*      200:
*        description: User setting updated
*        schema:
*          type: object
*/
settingRouter.get(
  '/',
  middlewares.authenticate,
  settingController.getUserSetting
);
export default settingRouter;
