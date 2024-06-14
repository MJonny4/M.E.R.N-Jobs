import { sign, verify, Secret, JwtPayload } from 'jsonwebtoken'
//  import * as dotenv from "dotenv";
// dotenv.config();

export const createJWT = (payload: JwtPayload): string => {
    const token = sign(payload, process.env.JWT_SECRET as Secret, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })
    return token
}

export const verifyJWT = (token: string): JwtPayload => {
    const decoded = verify(token, process.env.JWT_SECRET as Secret) as JwtPayload
    return decoded
}
