import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    lastName: string;
    email: string;
    password: string;
    location: string;
    role: "user" | "admin";
    avatar: string;
    avatarPublicId: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
        },
        password: {
            type: String,
        },
        location: {
            type: String,
            default: "my city",
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        avatar: {
            type: String,
        },
        avatarPublicId: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export default model<IUser>("User", UserSchema);