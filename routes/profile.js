import express from 'express';
import profileController from '../controllers/profileController';
import middlewares from '../middlewares';


const profileRouter = express.Router();


profileRouter.post('/profile', middlewares.validateCreateProfile, profileController.create);

export default profileRouter;
