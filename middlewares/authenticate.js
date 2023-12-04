import jwt from 'jsonwebtoken';

import { User } from '../models/User.js';
import { httpError } from '../helpers/httpError.js';
import { ctrlWrapper } from '../decorators/ctrlWrapper.js';

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        throw httpError(401, "Not authorized")
    };
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
        throw httpError(401)
    };
    try {
        const { id } = jwt.verify(token, JWT_SECRET)
        const user = await User.findById(id)
        if (!user || !user.token || user.token !== token) {
            throw httpError(401, "Not authorized")
        }
        req.user = user;
        next();
    } catch (error) {
        throw httpError(401, error.message)
    }
}

export default ctrlWrapper(authenticate)