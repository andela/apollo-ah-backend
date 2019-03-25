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
 *       id:
 *         type: integer
 *       name:
 *         type: string
 */

/**
 * @swagger
 * /api/v1/roles:
 *   get:
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
 *   get:
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
 *       - name: name
 *         description: Role name
 *         in: body
 *         required: true
 *         type: string
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
 *   patch:
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
 *       - name: name
 *         description: Role name
 *         in: body
 *         required: true
 *         type: string
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

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     tags:
 *       - permission
 *     description: Assign permission to role
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: permissionList
 *         description: List of permissions
 *         in: body
 *         required: true
 *         type: array
 *     responses:
 *       201:
 *         description: Successfuly assigned permission
 *         schema:
 *           $ref: '#/definitions/Role'
 */
router.post(
  '/:roleId/permissions',
  Validator.validateRoleId(),
  Validator.validateRolePermission(),
  ValidatorHandler.handleValidation,
  middlewares.authenticate,
  middlewares.permit('admin'),
  RolesController.assignPermision
);

export default router;
