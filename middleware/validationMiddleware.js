import { body, param, validationResult } from "express-validator";
import {
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
} from "../errors/customError.js";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";
import mongoose from "mongoose";
import Job from "../models/jobModel.js";
import User from "../models/userModel.js";

const withValidationErrors = (validateValues) => {
    return [
        validateValues,
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map((error) => error.msg);
                if (errorMessages[0].startsWith("No job with id:")) {
                    throw new NotFoundError(errorMessages);
                }
                if (errorMessages[0].startsWith("not authorized to")) {
                    throw new UnauthorizedError(
                        "not authorized to access this job"
                    );
                }
                throw new BadRequestError(errorMessages);
            }
            next();
        },
    ];
};

export const validateJobInput = withValidationErrors([
    body("company")
        .notEmpty()
        .withMessage("Company is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Company must be between 2 and 50 characters"),
    body("position")
        .notEmpty()
        .withMessage("Position is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Position must be between 2 and 50 characters"),
    body("jobLocation")
        .notEmpty()
        .withMessage("Job location is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Job location must be between 2 and 50 characters"),
    body("jobStatus")
        .notEmpty()
        .withMessage("Job status is required")
        .isIn(Object.values(JOB_STATUS))
        .withMessage(
            "Job status must be either pending, interview or rejected"
        ),
    body("jobType")
        .notEmpty()
        .withMessage("Job type is required")
        .isIn(Object.values(JOB_TYPE))
        .withMessage(
            "Job type must be either full-time, part-time or internship"
        ),
]);

export const validateIdParam = withValidationErrors([
    param("id").custom(async (value, { req }) => {
        const isValid = mongoose.Types.ObjectId.isValid(value);
        if (!isValid) throw new Error("Invalid MongoDB id");

        const job = await Job.findById(value);
        if (!job) throw new NotFoundError(`No job with id: ${value}`);

        const isAdmin = req.user.role === "admin";
        const isOwner = req.user.userId === job.user.toString();

        if (!isAdmin && !isOwner) {
            throw new UnauthorizedError(`not authorized to access this job`);
        }
    }),
]);

export const validateRegisterInput = withValidationErrors([
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be between 2 and 50 characters"),
    body("lastName")
        .notEmpty()
        .withMessage("Last name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Last name must be between 2 and 50 characters"),
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid")
        .custom(async (email) => {
            const user = await User.findOne({ email });
            if (user) throw new BadRequestError("Email already in use");
        }),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),
    body("location")
        .notEmpty()
        .withMessage("Location is required")
        .isLength({ min: 3, max: 85 })
        .withMessage("Location must be between 3 and 85 characters"),
]);

export const validateLoginInput = withValidationErrors([
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),
]);

export const validateUpdateUserInput = withValidationErrors([
    body("name").notEmpty().withMessage("name is required"),
    body("email")
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("invalid email format")
        .custom(async (email, { req }) => {
            const user = await User.findOne({ email });
            if (user && user._id.toString() !== req.user.userId) {
                throw new Error("email already exists");
            }
        }),
    body("lastName").notEmpty().withMessage("last name is required"),
    body("location").notEmpty().withMessage("location is required"),
]);
