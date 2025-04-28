const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // Check if the user's role is included in the list of allowed roles
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'You are not authorized to perform this action' });
        }
        next(); // User has the required role, continue to the next middleware or route handler
    };
};

export default authorizeRoles;
