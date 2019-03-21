// import models from '../models';
import Response from '../helpers/responseHelper';
import { STATUS } from '../helpers/constants';

/**
 * Wrapper class for sending user statistics numbers and breakdowns as response.
 *
 * @export
 * @class StatiticsController
 */
export default class StatiticsController {
  /**
   * This controller combines the results of the calculated stats
   * and returns the user stats object
   * @static
   * @param {function} req The request object
   * @param {fucntion} res The response object
   * @returns {function} The stats object
   */
  static async sendUserStats(req, res) {
    const { stats } = res.locals;
    return Response.send(res, STATUS.OK, stats, 'stats successfully fetched', true);
  }
}
