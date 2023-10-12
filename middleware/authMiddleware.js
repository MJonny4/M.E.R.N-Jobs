import { UnauthorizedError, BadRequestError } from "../errors/customError.js";
import { verifyJWT } from "../utils/tokenUtils.js";

export const authenticateUser = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) throw new UnauthorizedError("Authorization missing");

    try {
        const { userId, role } = verifyJWT(token);

        const testUser = userId === "6523f4e556165059e5f8f5cd";
        req.user = { userId, role, testUser };

        next();
    } catch (error) {
        throw new Unauth("Authorization missing");
    }
};

/**
 * Middleware function to authorize user permissions based on their role.
 * @param  {...string} roles - List of roles authorized to access the route.
 * @returns {function} - Express middleware function.
 * @throws {UnauthorizedError} - If user role is not authorized to access the route.
 */
export const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new UnauthorizedError("Unauthorized to access this route");
        }
        next();
    };
};

export const checkForTestUser = (req, res, next) => {
    if (req.user.testUser) throw new BadRequestError("Test user cannot perform this action");
    next();
};
