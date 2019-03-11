import express from 'express';
import passport from '../auth/passport';
// import { env, validateConfigVariable } from '../helpers/utils';
import authController from '../controllers/auth';


const router = express.Router();

// login user using social authentication
router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/redirect',
  passport.authenticate('facebook', { failureRedirect: '/' }), authController.socialAuth);

router.get('/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ]
  }));

router.get('/google/redirect',
  passport.authenticate('google', { failureRedirect: '/' }),
  authController.socialAuth);

router.get('/twitter',
  passport.authenticate('twitter', { scope: ['include_email=true'] }));

router.get('/twitter/redirect',
  passport.authenticate('twitter', { failureRedirect: '/' }),
  authController.socialAuth);


export default router;
