import { httpError } from "../helpers/httpError.js";

export const isEmptyBody = async(req, res, next)=> {
    const keys = Object.keys(req.body);
    console.log(req.body);
    if(!keys.length) {
        return next(httpError(400, "Body must have fields"))
    }
    next();
}
