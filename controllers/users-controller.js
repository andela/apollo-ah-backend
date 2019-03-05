import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import models from '../models';
import { env } from '../helpers/utils';

const generateToken = async payload => jwt.sign(payload, env('APP_KEY'));

const { User } = models;

/**
 * Class representing users controller
 *
 * @class UsersController
 */
class UsersController {
  /**
   * Creates a new user resource
   *
   * @static
   * @param {Request} request - Request object
   * @param {Response} response - Response object
   * @param {NextFunction} next - Express next function
   * @returns {void}
   *
   * @memberof UsersController
   */
  static async index(request, response, next) {
    const { body } = request;

    try {
      const user = await User.create(body);
      const token = await generateToken({ user });

      response
        .status(201)
        .json({ token, id: user.id });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Authenticate a user
   *
   * @static
   * @param {Request} request - Request object
   * @param {Response} response - Response object
   * @param {NextFunction} next - Express next function
   * @returns {void}
   *
   * @memberof UsersController
   */
  static async login(request, response, next) {
    const { body: { username, password } } = request;

    try {
      const user = await User.findOne({ where: { username } });

      // validate user password
      if (user && !bcrypt.compareSync(password, user.password)) {
        throw createError(401, 'Invalid credentials');
      }

      // generate token from user payload
      const payload = JSON.stringify(user.dataValues);
      const token = await generateToken(payload);

      // respond with token
      response
        .status(200)
        .json({ token, id: user.id });
    } catch (error) {
      next(error);
    }
  }
}

export default UsersController;
