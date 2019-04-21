import ResponseHandler from '../helpers/responseHelper';

/**
 * Render an exception into an HTTP response
 *
 * @param {Error} err - Error object
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {NextFunction} next call to the middleware
 * @return {Response} Final response
 */
const exceptionHandler = (err, req, res, next) => {
  const { message } = err;
  const error = req.app.get('env') === 'development' ? err : {};
  const statusCode = err.status || 500;
  return ResponseHandler.send(res, statusCode, error, message, false);
};

export default exceptionHandler;
