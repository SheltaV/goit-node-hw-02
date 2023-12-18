import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import Jimp from 'jimp';
import { nanoid } from 'nanoid';

import { User, emailRegex } from "../models/User.js";
import { httpError } from '../helpers/httpError.js';
import { ctrlWrapper } from '../decorators/ctrlWrapper.js';
import { sendEmail } from '../helpers/sendEmail.js';


const { JWT_SECRET, BASE_URL } = process.env;

const avatarsPath = path.resolve("public", "avatars");

const userSignUpSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().pattern(emailRegex).required(),
    subscription: Joi.string(),
})

const userSignInSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().pattern(emailRegex).required()
})

const userEmailSchema = Joi.object({
    email: Joi.string().pattern(emailRegex).required()
})


const updateSubscriptionSchema = Joi.object({
    subscription: Joi.string().valid("starter", "pro", "business").required()
})

const signUp = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw httpError(409, "Email in use")
    };
    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();

    const avatarUrl = gravatar.url(email);
    const newUser = await User.create({ ...req.body, password: hashPassword, avatarUrl, verificationToken });

    const verifyEmail = {
        to: email,
        theme: 'Verift your email',
        html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click to verify your email</a>`
    };
    await sendEmail(verifyEmail);

    res.status(201).json({
        user: {
    email: newUser.email,
    subscription: newUser.subscription
        }
    }) 
}

const verify = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
        throw httpError(404, "User not found")
    }
    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: ' ' })
    res.json({
        message: "Verification successful"
    })
}

const resendVerify = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw httpError(401, "Email not found")
    };
    if (!email) {
        throw httpError(400, "Missing required field email")
    };
    if (user.verify) {
        throw httpError(400, "Verification has already been passed")
    };
    const verifyEmail = {
        to: email,
        theme: 'Verift your email',
        html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click to verify your email</a>`
    };
    await sendEmail(verifyEmail);
    res.json({
        message: "Verification email sent"
    })
}

const signIn = async (req, res) => {
    const { email, password, subscription = "starter" } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw httpError(401, 'Email or password is wrong')
    }

    if (!user.verify) {
        throw httpError(401, "Email is not verified")
    }

    const passwordCompare = await bcrypt.compare(password, user.password)
    if (!passwordCompare) {
        throw httpError(401, 'Email or password is wrong')
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" })
    
    await User.findByIdAndUpdate(user._id, {token})

    res.json({
        token,
        user: {
    email,
    subscription
        } })
}

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;
    res.json({ email, subscription })
}

const signOut = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" })
    res.status(204).json()
}

const updateSubscription = async (req, res) => {
    const { _id: owner } = req.user;
    const { subscription } = req.body;
    const result = await User.findByIdAndUpdate(owner, { subscription }, { new: true })
    res.json(result)
}

const updateAvatar = async (req, res) => {
    const { _id: owner } = req.user;
    console.log(req.file)
    if (!req.file) {
    throw httpError(400, "File is not defined")
    };
    const { path: uploaded, originalname } = req.file;
    const avatar = await Jimp.read(uploaded);
    await avatar.cover(250, 250).writeAsync(uploaded);

    const filename = `${owner}_${originalname}`;
    const result = path.join(avatarsPath, filename);
    await fs.rename(uploaded, result);

    const avatarUrl = path.join("avatars", filename);

    await User.findByIdAndUpdate(owner, {avatarUrl})
    res.json({
        avatarUrl
    });
}

export default {
    userSignUpSchema, userSignInSchema, updateSubscriptionSchema, userEmailSchema,
    signUp: ctrlWrapper(signUp),
    verify: ctrlWrapper(verify),
    resendVerify: ctrlWrapper(resendVerify),
    signIn: ctrlWrapper(signIn),
    getCurrent: ctrlWrapper(getCurrent),
    signOut: ctrlWrapper(signOut),
    updateSubscription: ctrlWrapper(updateSubscription),
    updateAvatar: ctrlWrapper(updateAvatar)
}