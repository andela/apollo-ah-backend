import express from 'express';
import profileController from '../controllers/profileController';


const profileRouter = express.Router();


profileRouter.post('/', profileController.create);

export default profileRouter;
