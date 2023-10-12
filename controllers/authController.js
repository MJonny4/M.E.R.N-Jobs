import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";

// Models
import User from "../models/userModel.js";

// Utils
import { comparePasswords, hashPassword } from "../utils/passwordUtils.js";

// Errors
import { UnauthorizedError } from "../errors/customError.js";
import { createJWT } from "../utils/tokenUtils.js";

export const register = async (req, res) => {
    const isFirstAccount = (await User.countDocuments()) === 0;
    req.body.role = isFirstAccount ? "admin" : "user";

    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;

    const user = await User.create(req.body);
    res.status(StatusCodes.CREATED).json({
        msg: "User created successfully",
    });
};

export const login = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    const isValidUser =
        user && (await comparePasswords(req.body.password, user.password));

    if (!isValidUser) throw new UnauthorizedError("Invalid credentials");

    const token = createJWT({ userId: user._id, role: user.role });

    const oneDay = 1000 * 60 * 60 * 24;

    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    res.status(StatusCodes.OK).json({
        msg: "User logged in successfully",
    });
};

export const logout = async (req, res) => {
    res.cookie("token", "logout", {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ msg: "User logged out successfully" });
};
