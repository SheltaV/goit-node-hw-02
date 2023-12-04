import { Schema, model } from "mongoose";
import { preUpdate, saveHandleError } from "./hooks.js";

export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const userSchema = new Schema({
    password: {
        type: String,
        required: [true, 'Set password for user'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: emailRegex,
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: String
});

userSchema.post('save', saveHandleError)

userSchema.pre('findOneAndUpdate', preUpdate)

userSchema.post('findOneAndUpdate', saveHandleError)

export const User = model('user', userSchema);