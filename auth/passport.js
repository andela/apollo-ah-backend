import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import GoogleStrategy from 'passport-google-oauth2';
import TwitterStrategy from 'passport-twitter';
import { env, validateConfigVariable } from '../helpers/utils';
import logger from '../helpers/logger';
import models from '../models';

const { User } = models;

// Ensure that ENV config variables is set
validateConfigVariable([
  'FACEBOOK_APP_ID',
  'FACEBOOK_APP_SECRET',
  'FACEBOOK_CALLBACK_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_CALLBACK_URL',
  'TWITTER_CONSUMER_KEY',
  'TWITTER_CONSUMER_SECRET',
  'TWITTER_CALLBACK_URL'
]);

/**
   * @function
   *
   * @param {string} accessToken
   * @param {undefined} refreshToken
   * @param {object} profile - information from facebook
   * @param {*} done - returns the user object
   * @returns {*} - passes execution to next middleware on route path
   * @memberof SocialAuthController
   */

export const generateOrFindUser = async (accessToken, refreshToken, profile, done) => {
  if (profile.emails[0]) {
    try {
      await User.findOrCreate({ where: { email: profile.emails[0].value } })
       /*the "spread" divides the array that findOrCreate method returns 
        into 2 parts and passes them as 
        arguments to the callback function, 
        which treats them as "user" and "created".*/
        .spread((user, created) => {
          done(null, user)
        })
    } catch (err) {
      next(err);
    }
  };
};

passport.use(new FacebookStrategy({
  clientID: env('FACEBOOK_APP_ID'),
  clientSecret: env('FACEBOOK_APP_SECRET'),
  callbackURL: env('FACEBOOK_CALLBACK_URL'),
  profileFields: ['id', 'displayName', 'photos', 'email']
}, generateOrFindUser));

passport.use(new GoogleStrategy({
  clientID: env('GOOGLE_CLIENT_ID'),
  clientSecret: env('GOOGLE_CLIENT_SECRET'),
  callbackURL: env('GOOGLE_CALLBACK_URL')
}, generateOrFindUser));

passport.use(new TwitterStrategy({
  consumerKey: env('TWITTER_CONSUMER_KEY'),
  consumerSecret: env('TWITTER_CONSUMER_SECRET'),
  callbackURL: env('TWITTER_CALLBACK_URL'),
  includeEmail: true,
}, generateOrFindUser));

export default passport;
