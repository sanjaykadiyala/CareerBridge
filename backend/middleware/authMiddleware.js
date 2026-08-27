const jwt = require("jsonwebtoken");

function authenticate(request, response, next) {
  const authorizationHeader = request.headers.authorization;

  if (
    !authorizationHeader ||
    !authorizationHeader.startsWith("Bearer ")
  ) {
    return response.status(401).json({
      message: "Authentication token is required",
    });
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    request.user = {
      id: decodedToken.userId,
      role: decodedToken.role,
    };

    next();
  } catch {
    return response.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

function authorizeRoles(...allowedRoles) {
  return function (request, response, next) {
    if (!allowedRoles.includes(request.user.role)) {
      return response.status(403).json({
        message: "You are not allowed to perform this action",
      });
    }

    next();
  };
}

module.exports = {
  authenticate,
  authorizeRoles,
};