import Joi from 'joi';
import bcrypt from 'bcrypt';

import { User, emailRegex } from "../models/User.js";
import { httpError } from '../helpers/httpError.js';
import { ctrlWrapper } from '../decorators/ctrlWrapper.js';

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
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw httpError(409, "email already exist")
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({...req.body, password: hashPassword});
    res.status(201).json({
        email: newUser.email,
    }) 
}

const signIn = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw httpError(401, 'Email or password invalid')
    }
    const passwordCompare = await bcrypt.compare(password, user.password)
    if (!passwordCompare) {
        throw httpError(401, 'Email or password invalid')
    }
    const token = "sdhfg.12e4.243"
    res.json({ token })
}

export default {
    userSignUpSchema, userSignInSchema,
    signUp: ctrlWrapper(signUp),
    signIn: ctrlWrapper(signIn)
}