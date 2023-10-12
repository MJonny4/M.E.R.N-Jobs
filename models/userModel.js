import { Schema, model } from "mongoose";

const UserSchema = new Schema(
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

export default model("User", UserSchema);
