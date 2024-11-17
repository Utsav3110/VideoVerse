class ApiError extends Error {
    constructor(
      statusCode,
      message = "Something went wrong",
      errors = [],
      data = null,
      stack = null
    ) {
      super(message);
      this.name = this.constructor.name;
      this.statusCode = statusCode;
      this.message = message;
      this.errors = errors;
      this.data = data;
      this.success = false;
  
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  
    // Method to format the error as a JSON object (useful for API responses)
    toJSON() {
      return {
        success: this.success,
        statusCode: this.statusCode,
        message: this.message,
        errors: this.errors,
        data: this.data,
      };
    }
  }
  
  // Export the ApiError class for use in other files
  export { ApiError };
  