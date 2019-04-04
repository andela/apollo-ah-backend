import models from '../models';
import Response from '../helpers/responseHelper';
import { STATUS, MESSAGE } from '../helpers/constants';

/**
 * Class representing tags controller
 *
 * @class RolesController
 */
class RolesController {
  /**
   * Creates a new role
   *
   * @static
   * @param {Request} request - Request object
   * @param {Response} response - Response object
   * @param {Function} next - Express next function
   * @returns {void}
   *
   * @memberof RolesController
   */
  static async createRole(request, response, next) {
    const { body } = request;
    try {
      const [role] = await models.Role.findOrCreate({
        where: body,
      });
      return Response.send(response, STATUS.CREATED, role, MESSAGE.CREATE_SUCCESS);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Fetch a list of all roles
   *
   * @static
   * @param {Request} request - Request object
   * @param {Response} response - Response object
   * @param {Function} next - Express next function
   * @returns {void}
   *
   * @memberof RolesController
   */
  static async getAllRoles(request, response, next) {
    try {
      const roles = await models.Role.findAll({
        include: {
          model: models.Permission,
          as: 'permissions',
          through: { attributes: [] }
        }
      });

      return Response.send(response, STATUS.OK, roles, '');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Fetch a single role
   *
   * @static
   * @param {Request} request - Request object
   * @param {Response} response - Response object
   * @param {Function} next - Express next function
   * @returns {void}
   *
   * @memberof RolesController
   */
  static async getRole(request, response, next) {
    const { roleId } = request.params;
    try {
      const role = await models.Role.findByPk(roleId);
      return Response.send(response, STATUS.OK, role, '');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates a specific role
   *
   * @static
   * @param {Request} request - Request object
   * @param {Response} response - Response object
   * @param {Function} next - Express next function
   * @returns {void}
   *
   * @memberof RolesController
   */
  static async updateRole(request, response, next) {
    const { body } = request;
    const { roleId } = request.params;
    try {
      const [, [role]] = await models.Role.update(body, {
        where: { id: roleId },
        returning: true
      });
      return Response.send(response, STATUS.OK, role, MESSAGE.UPDATE_SUCCESS);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Assign permission(s) to a specific role
   *
   * @static
   * @param {Request} request - Request object
   * @param {Response} response - Response object
   * @param {Function} next - Express next function
   * @returns {void}
   *
   * @memberof RolesController
   */
  static async assignPermision(request, response, next) {
    const { body: { permissionList } } = request;
    const { roleId } = request.params;
    try {
      const role = await models.Role.findByPk(roleId);
      const permissions = await models.Permission.findAll({
        where: { name: permissionList }
      });

      const [result] = await role.setPermissions(permissions);
      return Response.send(response, STATUS.OK, result);
    } catch (error) {
      next(error);
    }
  }
}

export default RolesController;
