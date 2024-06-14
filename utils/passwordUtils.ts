import { genSalt, hash, compare } from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
    const salt = await genSalt(12)
    const cryptPassword = await hash(password, salt)
    return cryptPassword
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    const isMatch = await compare(password, hashedPassword)
    return isMatch
}
