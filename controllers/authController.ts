import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

// Models
import User, { IUser } from "../models/userModel";

// Utils
import { comparePasswords, hashPassword } from "../utils/passwordUtils";

// Errors
import { UnauthorizedError } from "../errors/customError";
import { createJWT } from "../utils/tokenUtils";

export const register = async (req: Request, res: Response): Promise<void> => {
    const isFirstAccount = (await User.countDocuments()) === 0;
    req.body.role = isFirstAccount ? "admin" : "user";

    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;

    const user: IUser = await User.create(req.body);
    res.status(StatusCodes.CREATED).json({
        msg: "User created successfully",
    });
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const user: IUser | null = await User.findOne({ email: req.body.email });

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

export const logout = async (req: Request, res: Response): Promise<void> => {
    res.cookie("token", "logout", {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ msg: "User logged out successfully" });
};