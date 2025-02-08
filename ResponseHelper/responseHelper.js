class ResponseHelper {
    /**
     * Success response
     * @param {Object} res - Express response object
     * @param {Number} statusCode - HTTP status code
     * @param {String} message - Success message
     * @param {Object} [data={}] - Optional response data
     */
    static success(res, statusCode = 200, message = "Success", data = {}) {
      return res.status(statusCode).json({
        success: true,
        message,
        data,
      });
    }
  
    /**
     * Error response
     * @param {Object} res - Express response object
     * @param {Number} statusCode - HTTP status code
     * @param {String} message - Error message
     */
    static error(res, statusCode = 500, message = "An error occurred") {
      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  
    /**
     * Validation error response
     * @param {Object} res - Express response object
     * @param {Array} errors - List of validation errors
     */
    static validationError(res, errors) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }
  }
  
  module.exports = ResponseHelper;
  