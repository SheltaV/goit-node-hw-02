import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User, emailRegex } from "../models/User.js";
import { httpError } from '../helpers/httpError.js';
import { ctrlWrapper } from '../decorators/ctrlWrapper.js';

const { JWT_SECRET } = process.env;

const userSignUpSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().pattern(emailRegex).required(),
    subscription: Joi.string()
})

const userSignInSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().pattern(emailRegex).required()
})

const signUp = async (req, res) => {
    const { email, password, subscription = "starter" } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw httpError(409, "Email in use")
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({...req.body, password: hashPassword});
    res.status(201).json({
        user: {
    email,
    subscription
        }
    }) 
}

const signIn = async (req, res) => {
    const { email, password, subscription = "starter" } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw httpError(401, 'Email or password is wrong')
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
    res.status(204).json('')
}

export default {
    userSignUpSchema, userSignInSchema,
    signUp: ctrlWrapper(signUp),
    signIn: ctrlWrapper(signIn),
    getCurrent: ctrlWrapper(getCurrent),
    signOut: ctrlWrapper(signOut)
}