const authorizeRoles = (...allowedRoles) => {
  return (request, response, next) => {
    console.log("request.user.role");
    console.log(request.user);
    if (!allowedRoles.includes(request.user.role)) {
      return response.status(403).json({ message: "Access denied" });
    }
    next();
  };
}

module.exports = authorizeRoles;