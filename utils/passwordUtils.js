import bcrypt from "bcryptjs";

export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(12);
    const cryptPassword = await bcrypt.hash(password, salt);
    return cryptPassword;
}

export async function comparePasswords(password, hashedPassword) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}