import express from 'express';
import middlewares from '../middlewares';
import Validator from '../middlewares/validator';
import ValidatorHandler from '../middlewares/handleValidation';
import RolesController from '../controllers/rolesController';

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   Role:
 *     properties:
 *       title:
 *         type: string
 *       create:
 *         type: boolean
 *       read:
 *         type: boolean
 *       update:
 *         type: boolean
 *       delete:
 *         type: boolean
 *       global:
 *         type: boolean
 */

/**
 * @swagger
 * /api/v1/roles:
 *   post:
 *     tags:
 *       - roles
 *     description: Fetch a list of all roles
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *           $ref: '#/definitions/Role'
 */
router.get(
  '/',
  middlewares.authenticate,
  middlewares.permit('admin'),
  RolesController.getAllRoles
);

/**
 * @swagger
 * /api/v1/roles/:roleId:
 *   post:
 *     tags:
 *       - roles
 *     description: Fetch a specified role
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: roleId
 *         description: Role's identification number
 *         in: query
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *           $ref: '#/definitions/Role'
 */
router.get(
  '/:roleId',
  Validator.validateRoleId(),
  ValidatorHandler.handleValidation,
  middlewares.authenticate,
  middlewares.permit('admin'),
  RolesController.getRole
);

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     tags:
 *       - create role
 *     description: Create new role
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: title
 *         description: Role's title
 *         in: body
 *         required: true
 *         type: boolean
 *       - name: create
 *         description: Role's create right
 *         in: body
 *         type: boolean
 *       - name: read
 *         description: Role's read right
 *         in: body
 *         type: boolean
 *       - name: update
 *         description: Role's update right
 *         in: body
 *         type: boolean
 *       - name: delete
 *         description: Role's delete right
 *         in: body
 *         type: boolean
 *       - name: global
 *         description: Role's global access right
 *         in: body
 *         type: boolean
 *     responses:
 *       201:
 *         description: Successfuly created a new role
 *         schema:
 *           $ref: '#/definitions/Role'
 */
router.post(
  '/',
  Validator.validateRoleData(),
  ValidatorHandler.handleValidation,
  middlewares.authenticate,
  middlewares.permit('admin'),
  RolesController.createRole
);

/**
 * @swagger
 * /api/v1/roles/:roleId:
 *   post:
 *     tags:
 *       - update role
 *     description: Update a role
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: roleId
 *         description: Role's identification number
 *         in: query
 *         required: true
 *         type: integer
 *       - name: title
 *         description: Role's title
 *         in: body
 *         required: true
 *         type: string
 *       - name: create
 *         description: Role's create right
 *         in: body
 *         type: boolean
 *       - name: read
 *         description: Role's read right
 *         in: body
 *         type: boolean
 *       - name: update
 *         description: Role's update right
 *         in: body
 *         type: boolean
 *       - name: delete
 *         description: Role's delete right
 *         in: body
 *         type: boolean
 *       - name: global
 *         description: Role's global access right
 *         in: body
 *         type: boolean
 *     responses:
 *       200:
 *         description: Successfuly updated role
 *         schema:
 *           $ref: '#/definitions/Role'
 */
router.patch(
  '/:roleId',
  Validator.validateRoleId(),
  Validator.validateRoleData(),
  ValidatorHandler.handleValidation,
  middlewares.authenticate,
  middlewares.permit('admin'),
  RolesController.updateRole
);

export default router;
