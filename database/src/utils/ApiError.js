// Custom error class extending JavaScript's built-in Error class
class ApiError extends Error {
    constructor(
        statusCode,  // HTTP status code (e.g., 400 for Bad Request, 500 for Internal Server Error)
        message = "Something went wrong", // Default error message
        errors = [], // Additional error details (e.g., validation errors)
        stack = ""  // Optional stack trace for debugging
    ) {
        super(message); // Call the parent class (Error) constructor with the message
        this.statusCode = statusCode; // Store the HTTP status code
        this.data = null; // Default data to null (can be extended if needed)
        this.success = false; // Indicates that the request was not successful
        this.errors = errors; // Store additional error details

        // If a stack trace is provided, use it; otherwise, capture a new stack trace
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// Export the ApiError class for use in other files
export { ApiError };
