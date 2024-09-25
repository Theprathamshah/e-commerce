
class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

class NotFoundError extends CustomError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class ValidationError extends CustomError {
  constructor(message = 'Invalid input') {
    super(message, 400);
  }
}

class InternalServerError extends CustomError {
  constructor(message = 'Something went wrong') {
    super(message, 500);
  }
}

class UserNotFound extends CustomError {
  constructor(message = 'User not found!') {
    super(message,404)
  }
}

class UnauthorizedError extends CustomError {
  constructor(message = 'You are unauthorized to perform this action') {
    super(message,401)
  }
}

class ForbiddenError extends CustomError {
  constructor(message = 'Access to requested resource is forbidden') {
    super(message,403)
  }
}

export { CustomError, NotFoundError, ValidationError, InternalServerError, UserNotFound, UnauthorizedError, ForbiddenError };