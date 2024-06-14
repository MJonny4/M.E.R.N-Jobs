import { BadRequestError, UnauthorizedError } from '../errors/customError'
import { verifyJWT } from '../utils/tokenUtils'

export const authenticateUser = (req, res, next) => {
    const { token } = req.cookies
    if (!token) throw new UnauthorizedError('Authorization missing')

    try {
        const { userId, role } = verifyJWT(token)

        const testUser = userId === '666c1a645e7eea7baa210445'
        req.user = { userId, role, testUser }

        next()
    } catch (error) {
        throw new UnauthorizedError('Authorization missing')
    }
}

/**
 * Middleware function to authorize user permissions based on their role.
 * @param  {...string} roles - List of roles authorized to access the route.
 * @returns {function} - Express middleware function.
 * @throws {UnauthorizedError} - If user role is not authorized to access the route.
 */
export const authorizePermissions = (...roles: any[]): Function => {
    return (req: { user: { role: any } }, res: any, next: () => void) => {
        if (!roles.includes(req.user.role)) {
            throw new UnauthorizedError('Unauthorized to access this route')
        }
        next()
    }
}

export const checkForTestUser = (req: { user: { testUser: any } }, res: any, next: () => void) => {
    if (req.user.testUser) throw new BadRequestError('Test user cannot perform this action')
    next()
}
